const config = require('../config');

const {
  fetch,
  fetchAsTestUser,
  fetchAsAdmin,
  fetchWithAuth,
} = process;

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
    fetch('/users/foo@bar.baz').then((resp) => expect(resp.status).toBe(401))
  ));

  /*   it('should fail with 403 when not owner nor admin', () => (
      fetchAsTestUser('/users/andressa@bq.com')
        .then((resp) => {
          expect(resp.status).toBe(403);
        })
    )); */

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/users/abc@def.ghi')
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should get own user', () => (
    fetchAsTestUser('/users/test@test.com')
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.email).toBe('test@test.com'))
  ));

  it('should get other user as admin', () => (
    fetchAsAdmin('/users/test@test.com')
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.email).toBe('test@test.com'))
  ));
});

describe('POST /users', () => {
  it('should respond with 400 when email and password missing', () => (
    fetchAsAdmin('/users', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should respond with 400 when email is missing', () => (
    fetchAsAdmin('/users', { method: 'POST', body: { email: '', password: 'xxxx' } })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should respond with 400 when password is missing', () => (
    fetchAsAdmin('/users', { method: 'POST', body: { email: 'foo@bar.baz' } })
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
        email: 'test1@test.com',
        password: '12345',
        role: 'chef',
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
        email: 'admin1@test.com',
        password: '12345',
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
      body: { email: 'test1@test.com', password: '123456', role: 'waiter' },
    })
      .then((resp) => expect(resp.status).toBe(409))
  ));
});

describe('PATCH /users/:uid', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/users/test@test.com', { method: 'PATCH' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when no admin', () => (
    fetchAsTestUser('/users/test@test.com', { method: 'PATCH' })
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/users/abcdefg@***', {
      method: 'PATCH',
      body: { password: 'ohmygod' }
    })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should fail with 400 when no props to update', () => (
    fetchAsAdmin('/users/test@test.com', { method: 'PATCH' })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should update user when admin', () => (
    fetchAsAdmin('/users/test@test.com', {
      method: 'PATCH',
      body: { password: 'abcdefgh' },
    })
      .then((resp) => expect(resp.status).toBe(200))
      .then(() => fetch('/login', {
        method: 'POST',
        body: { email: 'test@test.com', password: 'abcdefgh' },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json).toHaveProperty('accessToken'))
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
    fetchAsAdmin('/users/abdc@***', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should delete a user', () => (
    fetchAsAdmin('/users/test1@test.com', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(200))
  ));
});