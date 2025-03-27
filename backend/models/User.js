const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');


const sugarLevelsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added userId
    mealType: { type: String, required: true, default: "initial" },
    fastingSugarLevel: { type: Number, required: true, default: -1 },
    preMealSugarLevel: { type: Number, required: true, default: -1 },
    postMealSugarLevel: { type: Number, required: true, default: -1 },
    date: { type: Date, required: true }
});


const userSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    diabetesType: { type: String, required: true },
    sugarLevels:{type : [sugarLevelsSchema],required: true},
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
// const sugarLevels = mongoose.model("")


module.exports = User;
