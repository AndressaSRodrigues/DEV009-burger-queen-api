const {
  fetch,
  fetchAsTestUser,
  fetchAsAdmin,
} = process;

describe('POST /orders', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders', {
      method: 'POST'
    })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 400 when bad props', () => (
    fetchAsTestUser('/orders', {
      method: 'POST', body: {}
    })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should fail with 400 when empty items', () => (
    fetchAsTestUser('/orders', {
      method: 'POST',
      body: {
        products: []
      },
    })
      .then((resp) => {
        expect(resp.status).toBe(400);
      })
  ));

  it('should create order as user', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test',
          price: 10,
          image: 'image.png',
          type: 'drinks'
        },
      }),
      fetchAsTestUser('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(500);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'Client 1',
          products: [{
            qty: 5,
            product,
          }]
          },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => {
        expect(typeof json._id).toBe('string');
        expect(json.client).toBe('Client 1');
        expect(typeof json.dateEntry).toBe('string');
        expect(Array.isArray(json.products)).toBe(true);
        expect(json.products.length).toBe(1);
        expect(json.products[0].product.name).toBe('Test');
        expect(json.products[0].product.price).toBe(10);
      })
  ));

  it('should get order as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test',
          price: 10,
          image: 'image.png',
          type: 'drinks'
        },
      }),
      fetchAsAdmin(`/users/${config.adminEmail}`),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(500);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'Client 1',
          products: [{
            qty: 5,
            product,
          }]
          },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/orders/${json._id}`))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.products.length).toBe(1);
        expect(json.products[0].product.name).toBe('Test');
        expect(json.products[0].product.price).toBe(10);
      })
  ));
});

describe('GET /orders', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders')
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should get orders as user', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'GET',
      }),
      fetchAsTestUser('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(() => (
        Promise.all([
          fetchAsTestUser('/orders', {
            method: 'GET',
          }),
          fetchAsAdmin('/orders', {
            method: 'GET',
          }),
        ])
          .then((responses) => {
            expect(responses[0].status).toBe(200);
            return fetchAsTestUser('/orders');
          })
          .then((resp) => {
            expect(resp.status).toBe(200);
            return resp.json();
          })
      ))
      .then((orders) => {
        expect(Array.isArray(orders)).toBe(true);
        expect(orders.length > 0);
      })
  ));

  it('should get orders as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'GET',
      }),
      fetchAsTestUser('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(() => (
        Promise.all([
          fetchAsTestUser('/orders', {
            method: 'GET',
          }),
          fetchAsAdmin('/orders', {
            method: 'GET',
          }),
        ])
          .then((responses) => {
            expect(responses[0].status).toBe(200);
            return fetchAsAdmin('/orders');
          })
          .then((resp) => {
            expect(resp.status).toBe(200);
            return resp.json();
          })
      ))
      .then((orders) => {
        expect(Array.isArray(orders)).toBe(true);
        expect(orders.length > 0);
      })
  ));
});

describe('GET /orders/:orderId', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders/xxx')
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 404 when order not found', () => (
    fetchAsAdmin('/orders/xxx')
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should get order as user -----------', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'GET',
      }),
      fetchAsTestUser('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(500);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(() => fetchAsTestUser('/orders', {
        method: 'GET',
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => fetchAsTestUser(`/orders/${json._id}`))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.products.length).toBe(1);
      })
  ));

  it('should get order as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'GET',
      }),
      fetchAsTestUser('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(() => fetchAsTestUser('/orders', {
        method: 'GET',
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/orders/${json._id}`))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.products.length).toBe(1);
      })
  ));
});

describe('PATCH /orders/:orderId', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders/xxx',{
      method: 'PATCH'
    })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 400 when bad request', () => (
    fetchAsAdmin('/orders/xxx', {
      method: 'PATCH',
    })
      .then((resp) => expect(resp.status).toBe(400))
  ));
 
  it('should update order (set status to preparing)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 66 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('pending');
        return fetchAsAdmin(`/orders/${json._id}`, {
          method: 'PUT',
          body: { status: 'preparing' },
        });
      })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.status).toBe('preparing'))
  ));

  it('should update order (set status to delivering)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 66 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('pending');
        return fetchAsAdmin(`/orders/${json._id}`, {
          method: 'PUT',
          body: { status: 'delivering' },
        });
      })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.status).toBe('delivering'))
  ));

  it('should update order (set status to delivered)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 66 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('pending');
        return fetchAsAdmin(`/orders/${json._id}`, {
          method: 'PUT',
          body: { status: 'delivered' },
        });
      })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('delivered');
        expect(typeof json.dateProcessed).toBe('string');
      })
  ));
});

describe('DELETE /orders/:orderId', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders/xxx', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 404 when not found', () => (
    fetchAsAdmin('/orders/xxx', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should delete other order as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 25 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then(
        ({ _id }) => fetchAsAdmin(`/orders/${_id}`, { method: 'DELETE' })
          .then((resp) => ({ resp, _id })),
      )
      .then(({ resp, _id }) => {
        expect(resp.status).toBe(200);
        return fetchAsAdmin(`/orders/${_id}`);
      })
      .then((resp) => expect(resp.status).toBe(404))
  ));
});
