const bcrypt = require('bcrypt');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  User,
  getUsers,
  getUserByEmail,
  createUser,
  getUserById,
  deleteUserById,
  updateUserById,
} = require('../controller/users');

const initAdminUser = async (app, next) => {
  const { adminName, adminEmail, adminPassword } = app.get('config');

  if (!adminEmail || !adminPassword) {
    return next();
  }

  try {
    const existingAdminUser = await getUserByEmail(adminEmail);

    if (!existingAdminUser) {
      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: bcrypt.hashSync(adminPassword, 10),
        role: 'admin',
      });

      await createUser(adminUser);
    }

  } catch (error) {
    console.log(error);
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
