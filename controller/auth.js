const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { getUserByEmail } = require('./users');

const { secret } = config;

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(400);
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(400).json({ err: 'User not found' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    console.log(user.password)
    return res.status(400).json({ err: 'Invalid password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret);
  return res.json({ accessToken: token, user });
};

module.exports = { login };
