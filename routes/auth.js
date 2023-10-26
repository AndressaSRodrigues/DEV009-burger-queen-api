const jwt = require('jsonwebtoken');
const bcrypt =  require('bcrypt');
const config = require('../config');
const { getUserByEmail } = require('../controller/users')

const { secret } = config;

module.exports = (app, nextMain) => {

  app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(400).json({ err: 'User not found' });
    }

    return res.json({ user });

    next();
  });

  return nextMain();
};
