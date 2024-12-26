const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validations/validation'); // Corrected import syntax

const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    // Validation 1 to check user input
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message }); // Corrected status code usage
    }

    // Validation 2 to check if the user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.status(400).send({ message: 'User already exists' });
    }

    const salt = await bcryptjs.genSalt(10); // Increased salt rounds for better security
    const hashedPassword = await bcryptjs.hash(req.body.password, salt); // Added salt to hash function

    // Code to insert data
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword // Use hashed password instead of plain text
    });

    try {
        const newUser = await user.save();
        res.status(201).send({ message: 'User registered successfully', user: newUser }); // Send success response with user info
    } catch (err) {
        res.status(400).send({ message: err.message }); // Improved error message handling
    }
});

// Login logic will go here
router.post('/login', async (req, res) => {

    // Validation 1 to check user input
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message })

    } 

    // Validation 2 to check if the user already exists 
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send({ message: 'User does not exist' });
    }

    // Validation 3 to check if the password is correct
    const validPassword = await bcryptjs.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send({ message: 'Invalid password' });
    }

    // Create and assign a token
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token)
})

module.exports = router;
