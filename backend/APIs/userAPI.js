const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require('../middlewares/authMiddlleware');
const UserApp = express.Router();

// **User Registration Route**
UserApp.post('/signup', expressAsyncHandler(async (req, res) => {
    try {
        const {
            userId, name, email, password, age, gender, diabetesType,
            fastingSugarLevel, preMealSugarLevel, postMealSugarLevel,
            dietaryPreference, dailyCaloricIntake, foodAllergies,
            mealTypePreference, activityLevel, weight, height
        } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Calculate BMI
        const BMI = weight / ((height / 100) ** 2); // height in cm

        // Create new user object
        const newUser = new User({
            userId, name, email, password: hashedPassword, age, gender, diabetesType,
            fastingSugarLevel, preMealSugarLevel, postMealSugarLevel,
            dietaryPreference, dailyCaloricIntake, foodAllergies,
            mealTypePreference, activityLevel, weight, height, BMI,
            sugarLevels: [{
                fastingSugarLevel,
                preMealSugarLevel,
                postMealSugarLevel,
                date: new Date()
            }]
        });

        // Save user to DB
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));

// **User Login**
UserApp.post('/login', expressAsyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const dbUser = await User.findOne({ email });

        if (!dbUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, dbUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: "Login successful",
            token,
            payload: dbUser // You can optionally send back user data (excluding password)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));

// **Log Sugar Levels**
UserApp.post('/log-sugar-levels', authMiddleware, expressAsyncHandler(async (req, res) => {
    try {
        const { userId, mealType, fastingSugarLevel, preMealSugarLevel, postMealSugarLevel } = req.body;
        
        const currentUser = await User.findOne({ userId });
        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const date = new Date();

        if (currentUser.sugarLevels.length >= 30) {
            // Remove the oldest entry if there are 30 logs
            currentUser.sugarLevels.shift();
        }

        // Add new sugar level log
        currentUser.sugarLevels.push({
            mealType,
            fastingSugarLevel,
            preMealSugarLevel,
            postMealSugarLevel,
            date
        });

        await currentUser.save(); // Fix: Save user properly

        res.status(201).json({ message: "Sugar levels logged successfully", currentUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));

module.exports = UserApp;
