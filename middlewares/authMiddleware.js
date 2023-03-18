const jwt = require('jsonwebtoken');
const User = require('../models/user');
const jwtSecret = process.env.JWT_SECRET || `my_test_jwt_secret_key`;

async function authenticate (req, res, next) {
    try {
        // const token = req.header('Authorization').replace('Bearer', '');

        const token = req.body.token;
        if (!token) {
            return res.status(401).json({
                message : 'Authentication Failed!'
            });
        }

        const decoded = await jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err && err.message === "jwt expired") 
                throw new Error("Authentication Failed. Please Logout And Login Again.");
                
                return decoded;
        });
      
        const user = await User.findOne({ 
            _id: decoded.id, 
            type: decoded.type,
        });

        if (!user) {
           return res.status(401).json({ message : 'Authentication Failed!' });
        }

        req.body.user = user;
        req.body.token = token;

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({message : error.message });
    }
}

module.exports = { authenticate };