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
    try {
      const users = await getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.get('/users/:uid', requireAuth, (req, resp) => {
  });

  app.post('/users', requireAdmin, (req, resp, next) => {
    // TODO: implementar la ruta para agregar
    // nuevos usuarios
  });

  app.put('/users/:uid', requireAuth, (req, resp, next) => {
  });

  app.delete('/users/:uid', requireAuth, (req, resp, next) => {
  });

  initAdminUser(app, next);
};
