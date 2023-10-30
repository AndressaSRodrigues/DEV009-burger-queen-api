const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    if (!decodedToken.id) {
      return next(403);
    }

    req.user = decodedToken;

    next();
  });
};

module.exports.isAuthenticated = (req) => {
  return req.user ? true : false;
};

module.exports.isAdmin = (req) => {
  return req.user && req.user.role === 'admin';
}

module.exports.requireAuth = (req, resp, next) => {
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
};

module.exports.requireAdmin = (req, resp, next) => {
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
};
