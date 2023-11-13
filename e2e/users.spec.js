const url = require('url');
const qs = require('querystring');
const config = require('../config');

const {
  fetch,
  fetchAsTestUser,
  fetchAsAdmin,
  fetchWithAuth,
} = process;

const parseLinkHeader = (str) => str.split(',')
  .reduce((memo, item) => {
    const [, value, key] = /^<(.*)>;\s+rel="(first|last|prev|next)"/.exec(item.trim());
    return { ...memo, [key]: value };
  }, {});

describe('GET /users', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/users').then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsTestUser('/users')
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should get users', () => (
    fetchAsAdmin('/users')
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(Array.isArray(json)).toBe(true);
        expect(json.length > 0).toBe(true);
      })
  ));
});

describe('GET /users/:uid', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/users/654a4d3dce3a17586ee33aeb')
    .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsTestUser(`/users/${config.adminEmail}`)
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should get user as admin', () => (
    fetchAsAdmin('/users/654a4d3dce3a17586ee33aeb')
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
  ));
});

describe('POST /users', () => {
  it('should respond with 400 when email and password missing', () => (
    fetchAsAdmin('/users', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should respond with 400 when email is missing', () => (
    fetchAsAdmin('/users', { method: 'POST', body: { email: '', password: 'xxxx', role: 'xx' } })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should respond with 400 when password is missing', () => (
    fetchAsAdmin('/users', { method: 'POST', body: { email: 'foo@bar.baz', role: 'xx' } })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should respond with 400 when role is missing', () => (
    fetchAsAdmin('/users', { method: 'POST', body: { email: 'foo@bar.baz', password: 'xxxx' } })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should fail with 400 when invalid email', () => (
    fetchAsAdmin('/users', { method: 'POST', body: { email: 'failemail', password: '123456' } })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should fail with 400 when invalid password', () => (
    fetchAsAdmin('/users', { method: 'POST', body: { email: 'email@test.tes', password: '12' } })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should create new user', () => (
    fetchAsAdmin('/users', {
      method: 'POST',
      body: {
        email: 'waiter@test.com',
        password: '123456',
        role: 'waiter',
      },
    })
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => {
        expect(typeof json._id).toBe('string');
        expect(typeof json.email).toBe('string');
        expect(typeof json.password).toBe('string');
        expect(typeof json.role).toBe('string');
      })
  ));

  it('should create new admin user', () => (
    fetchAsAdmin('/users', {
      method: 'POST',
      body: {
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
      },
    })
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => {
        expect(typeof json._id).toBe('string');
        expect(typeof json.email).toBe('string');
        expect(typeof json.password).toBe('string');
        expect(typeof json.role).toBe('string');
      })
  ));

  it('should fail with 409 when user is already registered', () => (
    fetchAsAdmin('/users', {
      method: 'POST',
      body: { email: 'test@test.com', password: '123456', role: 'chef' },
    })
      .then((resp) => expect(resp.status).toBe(409))
  ));
});

describe('PATCH /users/:uid', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/users/foo@bar.baz', { method: 'PATCH' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 400 when no fields to update', () => (
    fetchAsAdmin('/users/test@test.com', { method: 'PATCH' })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should update user when admin', () => (
    fetchAsAdmin('/users/test@test.com', {
      method: 'PATCH',
      body: { password: '123456789' },
    })
      .then((resp) => expect(resp.status).toBe(200))
  ));

  it('should fail with 403 when not owner nor admin', () => (
    fetchAsTestUser(`/users/${config.adminEmail}`, { method: 'PATCH' })
      .then((resp) => expect(resp.status).toBe(403))
  ));
});

describe('DELETE /users/:uid', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/users/foo@bar.baz', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not owner nor admin', () => (
    fetchAsTestUser(`/users/${config.adminEmail}`, { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/users/abc@def.ghi', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should delete own user', () => {
    const credentials = { email: `foo-${Date.now()}@bar.baz`, password: '1234' };
    return fetchAsAdmin('/users', { method: 'POST', body: credentials })
      .then((resp) => expect(resp.status).toBe(200))
      .then(() => fetch('/auth', { method: 'POST', body: credentials }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then(({ accessToken }) => fetchWithAuth(accessToken)(`/users/${credentials.email}`, {
        method: 'DELETE',
      }))
      .then((resp) => expect(resp.status).toBe(200))
      .then(() => fetchAsAdmin(`/users/${credentials.email}`))
      .then((resp) => expect(resp.status).toBe(404));
  });

  it('should delete other user as admin', () => {
    const credentials = { email: `foo-${Date.now()}@bar.baz`, password: '1234' };
    return fetchAsAdmin('/users', { method: 'POST', body: credentials })
      .then((resp) => expect(resp.status).toBe(200))
      .then(() => fetchAsAdmin(`/users/${credentials.email}`, { method: 'DELETE' }))
      .then((resp) => expect(resp.status).toBe(200))
      .then(() => fetchAsAdmin(`/users/${credentials.email}`))
      .then((resp) => expect(resp.status).toBe(404));
  });
});
