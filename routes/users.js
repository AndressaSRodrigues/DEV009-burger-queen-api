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
    const users = await getUsers();
    console.log(users);
    return res.json(users);
  });

  app.get('/users/:uid', requireAuth, async (req, res) => {
    const uid = req.params.uid;
    const user = await getUserById(uid);
    return res.json(user);
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
      console.log(newUser)
      return res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'User creation failed' });
    }
  });

  app.put('/users/:uid', requireAuth, (req, res) => {


  });

  app.delete('/users/:uid', requireAuth, async (req, res) => {
    const uid = req.params.uid;
    const deleted = deleteUserById(uid)
    return res.status(200).json(deleted)
  });

  initAdminUser(app, next);
};
