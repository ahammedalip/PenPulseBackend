import jwt from 'jsonwebtoken';
import User from '../model/user.js';

const authenticateJWT = async(req, res, next) => {
  const token = req.cookies.userAuthToken; 

  if (!token) {
    return res.status(403).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded token is--------', decoded)
    const user = await User.find({isBlocked:false, isVerified:true})
    if(!user){
      console.log(' user in db is');
      return res.status(403).json({success:false, message: 'User is blocked'})
    }

    req.user = decoded.id;

    next(); 
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateJWT;
