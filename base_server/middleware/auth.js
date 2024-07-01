const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send({ message: 'Access denied. User Not logged in' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};

module.exports = auth;
