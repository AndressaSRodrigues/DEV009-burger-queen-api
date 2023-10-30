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
  const { adminEmail, adminPassword } = app.get('config');

  if (!adminEmail || !adminPassword) {
    return next();
  }

  try {
    const existingAdminUser = await getUserByEmail(adminEmail);

    if (!existingAdminUser) {
      const adminUser = new User({
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

  app.get('/users', requireAdmin, async (req, res) => {
    try {
      const users = await getUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: 'User update failed' });
    }
  });

  app.get('/users/:uid', requireAuth, async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await getUserById(uid);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'User update failed' });
    }
  });

  app.post('/users', requireAdmin, async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = new User({
      email,
      password,
      role,
    });

    try {
      const newUser = await createUser(user);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ message: 'User creation failed' });
    }
  });

  app.patch('/users/:uid', requireAuth, async (req, res) => {
    try {
      const uid = req.params.uid;
      const values = req.body;

      const updatedUser = await updateUserById(uid, values);

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: 'User update failed' });
    }
  });

  app.delete('/users/:uid', requireAuth, async (req, res) => {
    try {
      const uid = req.params.uid;
      const deleted = deleteUserById(uid);
      return res.status(200).json(deleted);
    } catch (error) {
      return res.status(500).json({ message: 'User delete failed' });
    }
  });

  initAdminUser(app, next);
};
