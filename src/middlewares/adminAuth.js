import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.authToken; // Get token from the cookie
  
  // if (!req.cookies || !req.cookies.token) {
  //   console.log('no toke present 11111111----------');
  //   // return res.status(403).json({ message: 'No token provided, authorization denied' });
  // }
  if (!token) {
    console.log(`no token present -----------`);
    return res.status(403).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // console.log('coming here to middleware=================' );
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user information to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateJWT;
