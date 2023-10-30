const bcrypt = require('bcrypt');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  User,
  getUsers,
  getUserByEmail,
  createUser
} = require('../controller/users');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  
  if (!adminEmail || !adminPassword) {
    return next();
  }

  try {
    const existingAdminUser = await getUserByEmail(adminEmail);

    if(!existingAdminUser){
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

  app.get('/users/:uid', requireAuth, (req, res) => {
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
  
  app.put('/users/:uid', requireAuth, (req, res, next) => {
  });

  app.delete('/users/:uid', requireAuth, (req, res, next) => {
  });

  initAdminUser(app, next);
};
