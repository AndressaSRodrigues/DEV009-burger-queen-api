const {
  fetch,
  fetchAsTestUser,
  fetchAsAdmin,
} = process;

describe('POST /products', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/products', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsTestUser('/products', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should fail with 400 when bad props', () => (
    fetchAsAdmin('/products', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should create product as admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: {
        name: 'Test',
        price: 5,
        image: 'image.png',
        type: 'drinks'
    },
    })
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => {
        expect(typeof json._id).toBe('string');
        expect(typeof json.name).toBe('string');
        expect(typeof json.price).toBe('number');
        expect(typeof json.image).toBe('string');
        expect(typeof json.type).toBe('string');
      })
  ));
});

describe('GET /products', () => {
  it('should get products with Auth', () => (
    fetchAsTestUser('/products')
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(Array.isArray(json)).toBe(true);
        json.forEach((product) => {
          expect(typeof product._id).toBe('string');
          expect(typeof product.name).toBe('string');
          expect(typeof product.price).toBe('number');
          expect(typeof product.image).toBe('string');
          expect(typeof product.type).toBe('string');
        });
      })
  ));
});

describe('GET /products/:productid', () => {
  it('should fail with 404 when not found', () => (
    fetchAsTestUser('/products/65419818a59437ee9d0fc81e')
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should get product with Auth', () => (
    fetchAsTestUser('/products')
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(Array.isArray(json)).toBe(true);
        expect(json.length > 0).toBe(true);
        json.forEach((product) => {
          expect(typeof product._id).toBe('string');
          expect(typeof product.name).toBe('string');
          expect(typeof product.price).toBe('number');
        });
        return fetchAsTestUser(`/products/${json[0]._id}`)
          .then((resp) => ({ resp, product: json[0] }));
      })
      .then(({ resp, product }) => {
        expect(resp.status).toBe(200);
        return resp.json().then((json) => ({ json, product }));
      })
      .then(({ json, product }) => {
        expect(json).toEqual(product);
      })
  ));
});

describe('PATCH /products/:productid', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/products/65419818a59437ee9d0fc81f', { method: 'PATCH' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: {
        name: 'Test',
        price: 10,
        image: 'image.png',
        type: 'drinks'
      },
    })
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsTestUser(`/products/${json._id}`, {
        method: 'PATCH',
        body: { price: 20 },
      }))
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/products/65419818a59437ee9d0fc81e', {
      method: 'PATCH',
      body: { price: 1 },
    })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should fail with 400 when bad props', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: {
        name: 'Test',
        price: 10,
        image: 'image.png',
        type: 'drinks'
      },
    })
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/products/${json._id}`, {
        method: 'PATCH',
        body: {
          title: 'Test'
        }
      }))
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should update product as admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: {
        name: 'Test',
        price: 10,
        image: 'image.png',
        type: 'drinks'
      },
    })
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/products/${json._id}`, {
        method: 'PATCH',
        body: { price: 20 },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.price).toBe(20))
  ));
});

describe('DELETE /products/:productid', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/products/xxx', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: {
        name: 'Test',
        price: 10,
        image: 'image.png',
        type: 'drinks'
      },
    })
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsTestUser(`/products/${json._id}`, { method: 'DELETE' }))
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/products/65419818a59437ee9d0fc81e', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should delete other product as admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: {
        name: 'Test',
        price: 10,
        image: 'image.png',
        type: 'drinks'
      },
    })
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then(
        ({ _id }) => fetchAsAdmin(`/products/${_id}`, { method: 'DELETE' })
          .then((resp) => ({ resp, _id })),
      )
      .then(({ resp, _id }) => {
        expect(resp.status).toBe(200);
        return fetchAsAdmin(`/products/${_id}`);
      })
      .then((resp) => expect(resp.status).toBe(404))
  ));
});
