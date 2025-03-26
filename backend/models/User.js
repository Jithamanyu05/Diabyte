const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    diabetesType: { type: String, required: true },
    fastingSugarLevel: { type: Number, required: true },
    preMealSugarLevel: { type: Number, required: true },
    postMealSugarLevel: { type: Number, required: true },
    dietaryPreference: { type: String, required: true },
    dailyCaloricIntake: { type: Number, required: true },
    foodAllergies: { type: [String], default: [] },
    mealTypePreference: { type: String },
    activityLevel: { type: String },
    weight: { type: Number, required: true },
    height: { type: Number, required: true }
});

// Create model
const User = mongoose.model("User", userSchema);

module.exports = User;
