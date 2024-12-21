const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token is invalid' });
    req.user = decoded;  // Attach decoded data to request
    next();
  });
};
module.exports = verifyToken;
