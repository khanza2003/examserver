const users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')  // Add bcrypt to hash passwords

// Register
exports.registerController = async (req, res) => {
    console.log("Inside registerController");
    const { firstName, lastName, emailAddress, password, phoneNumber } = req.body
    console.log(firstName, lastName, emailAddress, password, phoneNumber);

    try {
        const existingUser = await users.findOne({ emailAddress });
        if (existingUser) {
            return res.status(409).json("User already exists. Please login!");
        } else {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new users({
                firstName,
                lastName,
                emailAddress,
                password: hashedPassword,  // Store hashed password
                phoneNumber
            });
            await newUser.save();
            res.status(201).json(newUser);  // Return 'Created' status
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

// Login
exports.loginController = async (req, res) => {
    console.log("Inside loginController");
    const { emailAddress, password } = req.body;
    console.log(emailAddress, password);

    try {
        const existingUser = await users.findOne({ emailAddress });
        if (existingUser && await bcrypt.compare(password, existingUser.password)) {
            // Token generation if password matches
            const token = jwt.sign({ userId: existingUser._id }, process.env.JWTPASSWORD, { expiresIn: '1h' });  // Set token expiration for security

            res.status(200).json({
                user: existingUser,
                token
            });
        } else {
            res.status(401).json("Invalid Email or Password");
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

// List all users
exports.listUsersController = async (req, res) => {
    console.log("Inside listUsersController");

    try {
        const usersList = await users.find({}, '-password');
        res.status(200).json(usersList);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
}

// View user details
exports.viewUserDetailsController = async (req, res) => {
    const userId = req.params.id;  

    console.log("Inside viewUserDetailsController for user: ", userId);

    try {
        const user = await users.findById(userId, '-password');

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json("User not found");
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
}