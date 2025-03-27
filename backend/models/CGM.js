const mongoose = require("mongoose");

const sugarLevelsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added userId
    mealType: { type: String, required: true, default: "initial" },
    fastingSugarLevel: { type: Number, required: true, default: -1 },
    preMealSugarLevel: { type: Number, required: true, default: -1 },
    postMealSugarLevel: { type: Number, required: true, default: -1 },
    date: { type: Date, required: true }
});

module.exports = mongoose.model("CGM", sugarLevelsSchema);
