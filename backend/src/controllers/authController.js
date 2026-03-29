// 1. Fixed the capital 'U' in User
const User = require('../models/User.js'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    // Everything begins inside the try block!
    try {
        // --- CHECKPOINT 1: Intake ---
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide a username, email and password"
            });
        }

        // --- CHECKPOINT 2: The Bouncer ---
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ message: "A similar user exists" });
        }

        // --- CHECKPOINT 3: The Meat Grinder ---
        const saltRound = 10;
        // 3. Passed the saltRound into the function
        const salt = await bcrypt.genSalt(saltRound); 
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- CHECKPOINT 4: The Vault ---
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        // --- CHECKPOINT 5: The VIP Wristband ---
        const payload = { 
            userId: newUser._id 
        };
        
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }     
        );

        // --- CHECKPOINT 6: Delivery ---
        res.status(201).json({
            message: "User registered successfully!",
            token: token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        // If ANY of the code in the try block fails, it falls down here.
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error during registration." });
    }
}; // <-- The register function finally ends here!
const login = async (req, res) => {
    try {
        // --- CHECKPOINT 1: The Intake ---
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: "Please provide both an email and a password." 
            });
        }

        // --- CHECKPOINT 2: The Search ---
        // We ask MongoDB to find a user with this exact email.
        const user = await User.findOne({ email: email });

        if (!user) {
            // Mentor Tip: Never tell the user exactly WHICH part was wrong (email or password). 
            // If a hacker is guessing emails, you don't want to confirm "Yes, that email exists but wrong password."
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // --- CHECKPOINT 3: The Cryptographic Match ---
        // bcrypt.compare takes the plain text password, hashes it using the exact same salt stored in the DB, 
        // and checks if the two hashes match perfectly.
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // --- CHECKPOINT 4: The VIP Wristband ---
        // The credentials are correct! Generate the token.
        const payload = { 
            userId: user._id 
        };
        
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }     
        );

        // --- CHECKPOINT 5: The Delivery ---
        // Send back a 200 (OK) status with the token and safe user data.
        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error during login." });
    }
};
// NEW: Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        // req.user._id comes from your Bouncer (protect middleware)
        const user = await User.findById(req.user._id);

        if (user) {
            // Update the fields if the user provided them, otherwise keep the old ones
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            // If they are updating their password, make sure your User model has a pre-save hook to hash it!
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email
                }
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error while updating profile." });
    }
};



module.exports = { register, login , updateUserProfile};