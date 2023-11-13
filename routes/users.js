const bcrypt = require('bcrypt');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers,
  getUserByEmail,
  createUser,
  getOneUser,
  deleteUser,
  updateUser,
} = require('../controller/users');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');

  if (!adminEmail || !adminPassword) {
    return next();
  }

  try {
    const existingAdminUser = await getUserByEmail(adminEmail);

    if (!existingAdminUser) {
      const adminUser = {
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      };

      await createUser({ body: adminUser }, {
        status: () =>
          ({ json: () => '' })
      });
    }
  } catch (error) {
    console.error(error);
  }

  next();
};

module.exports = (app, next) => {
  app.get('/users', requireAdmin, getUsers);

  app.get('/users/:uid', requireAuth, getOneUser);

  app.post('/users', requireAdmin, createUser);

  app.patch('/users/:uid', requireAuth, updateUser);

  app.delete('/users/:uid', requireAuth, deleteUser);

  initAdminUser(app, next);
};
