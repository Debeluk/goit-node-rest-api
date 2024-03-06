import jwt from 'jsonwebtoken';
import User from '../schemas/userSchema';

const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authorizationHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized", error: error.message });
  }
};

export default authenticate;
