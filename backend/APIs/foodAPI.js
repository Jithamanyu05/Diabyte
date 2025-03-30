const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const router = express.Router();
require("dotenv").config();

// NutritionX API credentials
const NUTRITIONX_APP_ID = process.env.NUTRITIONX_APP_ID;
const NUTRITIONX_APP_KEY = process.env.NUTRITIONX_APP_KEY;

router.post("/log", async (req, res) => {
    try {
        const { userId, mealType, foodItems, inputMethod } = req.body;

        if (!userId || !mealType || !Array.isArray(foodItems) || foodItems.length === 0) {
            return res.status(400).json({ error: "Missing or invalid required fields" });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Convert foodItems into query format for Nutritionix
        const query = foodItems.map(item => `${item.quantity} ${item.name}`).join(", ");
        const url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
        const response = await axios.post(
            url,
            { query },
            {
                headers: {
                    "x-app-id": NUTRITIONX_APP_ID,
                    "x-app-key": NUTRITIONX_APP_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        // Extract food data
        const foodData = response.data.foods.map((food, index) => ({
            foodName: food.food_name,
            brandName: food.brand_name || "Generic",
            servingQty: foodItems[index]?.servingQty || 1,
            servingUnit: food.serving_unit,
            servingWeightGrams: food.serving_weight_grams,
            calories: food.nf_calories || 0,
            protein: food.nf_protein || 0,
            carbs: food.nf_total_carbohydrate || 0,
            fats: food.nf_total_fat || 0,
            fiber: food.nf_dietary_fiber,
            sugar: food.nf_sugars || 0,
            sodium: food.nf_sodium,
            potassium: food.nf_potassium,
            phosphorus: food.nf_p,
            fullNutrients: food.full_nutrients,
            photo: food.photo.thumb
        }));

        if (!response.data.foods || response.data.foods.length === 0) {
            return res.status(400).json({ error: "No valid food items found" });
        }

        // Calculate total nutrition values
        const totalCalories = foodData.reduce((sum, item) => sum + (item.calories || 0), 0);
        const totalProtein = foodData.reduce((sum, item) => sum + (item.protein || 0), 0);
        const totalCarbs = foodData.reduce((sum, item) => sum + (item.carbs || 0), 0);
        const totalFats = foodData.reduce((sum, item) => sum + (item.fats || 0), 0);
        const totalSugars = foodData.reduce((sum,item) => sum + (item.sugar || 0),0);
        const totalFiber = foodData.reduce((sum,item) => sum + (item.fiber || 0),0);
        

        // Create food log entry
        const foodLog = {
            mealType,
            foodItems: foodData,
            inputMethod,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFats,
            totalSugars,
            totalFiber,
            dateLogged: new Date()
        };

        // Save to user's database
        user.foodLogs.push(foodLog);
        await user.save();

        res.status(201).json({ message: "Food logged successfully", foodLog });

    } catch (error) {
        console.error("Error in /log:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/logs/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;  // Default: 10 logs per page

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        const startIndex = (page - 1) * limit;
        const paginatedLogs = user.foodLogs.slice(startIndex, startIndex + Number(limit));

        res.status(200).json({ 
            foodLogs: paginatedLogs, 
            totalLogs: user.foodLogs.length, 
            page, 
            limit 
        });

    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * @route DELETE /food/log/:userId/:logId
 * @desc Delete a specific food log for a user
 */
router.delete("/log/:userId/:logId", async (req, res) => {
    try {
        const { userId, logId } = req.params;

        // Fetch the user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the log index
        const logIndex = user.foodLogs.findIndex(log => log._id.toString() === logId);
        if (logIndex === -1) {
            return res.status(404).json({ error: "Food log not found" });
        }

        // Remove the log
        user.foodLogs.splice(logIndex, 1);
        await user.save();

        res.status(200).json({ message: "Food log deleted successfully" });

    } catch (error) {
        console.error("Error in /log/:userId/:logId:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
