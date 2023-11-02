const { login } = require('../controller/auth');

module.exports = (app, nextMain) => {
  app.post('/login', login);

  return nextMain();
};
