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

module.exports.isAuthenticated = (req) => !!req.user;

module.exports.isAdmin = (req) => req.user && req.user.role === 'admin';

module.exports.requireAuth = (req, resp, next) => {
  if (!module.exports.isAuthenticated(req)) {
    return next(401);
  }

  next();
};

module.exports.requireAdmin = (req, resp, next) => {
  if (!module.exports.isAuthenticated(req)) {
    return next(401);
  } if (!module.exports.isAdmin(req)) {
    return next(403);
  }

  next();
};
