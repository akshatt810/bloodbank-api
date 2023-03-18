const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET || `my_test_jwt_secret_key`;

function generateToken(user) {
    const payload = { 
        id:user._id.toString(), 
        type: user.type 
    };
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, jwtSecret, options);
}

async function hashPassword(password) {
    return hash = await bcrypt.hash(password, 10);
}

async function register(req, res) {
    try {
        const user = new User(req.body);
        if (user.password.length < 7) {
            const error = 'Password Must Be Atleast 7 Characters Long.'
            throw new Error(error);
        }

        user.password = await hashPassword(user.password);

        const token = await generateToken(user);
        user.tokens = user.tokens.concat({ token });
        await user.save();

        res.status(201).json({ token,});
    } catch (error) {
        console.log(error.message);
        return res.status(401).json(error.message);
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findByCredentials( email, password ); 

        const token = generateToken(user);
        user.tokens = user.tokens.concat({ token });
        await user.save();

        res.status(200).json({ token });
    } catch (error) {
        console.log(error.message);
        return res.status(error.status || 401).json(error.message);
    }
}

module.exports = {
    register,
    login,
}