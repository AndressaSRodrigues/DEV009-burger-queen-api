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

const { User } = require('../models/users');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');

  if (!adminEmail || !adminPassword) {
    return next();
  }

  const existingAdminUser = await getUserByEmail(adminEmail);
  if (!existingAdminUser) {
    const adminUser = new User({
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      role: 'admin',
    });

    await createUser(adminUser);
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
