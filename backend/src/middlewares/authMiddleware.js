const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Look for the token in the request headers
    // Standard practice is to send it in the "Authorization" header starting with "Bearer "
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token string
            // The header looks like: "Bearer abcdef12345..."
            // .split(' ')[1] splits it at the space and grabs just the token part
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token's cryptographic signature
            // If the signature is bad or the token expired, this will throw an error and jump to the catch block
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find the user in the database using the ID we hid inside the token payload
            // .select('-password') is a crucial security measure. It tells MongoDB: "Give me the user data, but LEAVE OUT the password hash!"
            req.user = await User.findById(decoded.userId).select('-password');

            // 5. The Bouncer steps aside!
            // This tells Express to move on to the actual route controller
            next(); 

        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({ message: "Not authorized, token failed." });
        }
    }

    // 6. If no token was provided at all in the header
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided." });
    }
};

module.exports = { protect };