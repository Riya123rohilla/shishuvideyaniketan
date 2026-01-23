const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    const decoded = jwt.verify(token, jwtSecret);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid'
    });
  }
};

module.exports = authMiddleware;
