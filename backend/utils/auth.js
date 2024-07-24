const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'YOUR_SECRET_KEY', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

exports.isServiceProvider = (req, res, next) => {
  if (req.user.role !== 'service_provider') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
