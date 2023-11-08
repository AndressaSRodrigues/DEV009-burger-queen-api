const bcrypt = require('bcrypt');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers,
  getUserByEmail,
  createUser,
  getUserById,
  deleteUserById,
  updateUserById,
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

  app.get('/users/:uid', requireAuth, getUserById);

  app.post('/users', requireAdmin, createUser);

  app.patch('/users/:uid', requireAuth, updateUserById);

  app.delete('/users/:uid', requireAuth, deleteUserById);

  initAdminUser(app, next);
};
