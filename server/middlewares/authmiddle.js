const jwt = require('jsonwebtoken');


const verifySuperAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmins can perform this action.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifySuperAdmin;
