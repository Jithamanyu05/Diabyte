const express = require("express");
const router = express.Router();
const CGM = require("../models/CGM");
const axios = require("axios");
require("dotenv").config();

const authMiddleware = require("../middlewares/authMiddlleware"); // Import Auth Middleware

// 🟢 1️⃣ Save CGM Data (Manual Input & Trigger Analysis)
router.post("/save", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("User ID from JWT:", userId);

        const { mealType, fastingSugarLevel, preMealSugarLevel, postMealSugarLevel, date } = req.body;

        const newEntry = new CGM({
            userId, 
            mealType, 
            fastingSugarLevel, 
            preMealSugarLevel, 
            postMealSugarLevel, 
            date
        });

        await newEntry.save();

        const analysis = await analyzeCGMData(userId);

        res.json({ message: "Data saved successfully in your log!", analysis });
    } catch (error) {
        console.error("Error in /save:", error);
        res.status(500).json({ error: error.message });
    }
});

// 🟢 2️⃣ Get Last 30 Days of CGM Data (Trends)
router.get("/trends", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await getLast30DaysCGM(userId);
        res.json(data);
    } catch (error) {
        console.error("Error in /trends:", error);
        res.status(500).json({ error: error.message });
    }
});

// 🟢 3️⃣ Get **Full History** of CGM Data
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await CGM.find({ userId }).sort({ date: 1 });

        if (!history.length) {
            return res.json({ message: "No CGM history found." });
        }

        res.json(history);
    } catch (error) {
        console.error("Error in /history:", error);
        res.status(500).json({ error: error.message });
    }
});

// 🟢 4️⃣ AI Analysis for CGM Data
router.get("/analyze", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const analysis = await analyzeCGMData(userId);
        res.json(analysis);
    } catch (error) {
        console.error("Error in /analyze:", error);
        res.status(500).json({ error: error.message });
    }
});

// 📌 **Helper Function to Get Last 30 Days of CGM Data**
async function getLast30DaysCGM(userId) {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return await CGM.find({ userId, date: { $gte: thirtyDaysAgo } }).sort({ date: 1 }).limit(30);
}

// 📌 **Helper Function to Analyze CGM Data**
async function analyzeCGMData(userId) {
    const cgmData = await getLast30DaysCGM(userId);

    if (!cgmData.length) return { message: "No data available for analysis." };

    const formattedData = cgmData.map(entry => ({
        meal: entry.mealType,
        fasting: entry.fastingSugarLevel,
        preMeal: entry.preMealSugarLevel,
        postMeal: entry.postMealSugarLevel,
        date: entry.date.toISOString().split("T")[0]
    }));

    try {
        console.log("📡 Sending user-specific sugar intake data to AI for analysis...");

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Analyze the following glucose readings and provide concise, user-friendly insights in bullet points.  
                                    Ensure the response is short (3-4 lines per section) and easy to understand.  

                                    - **Overall Analysis:** Summarize the trends in glucose levels.  
                                    - **Potential Risks:** Highlight any concerning patterns.  
                                    - **Personalized Insights:** Provide actionable diet or lifestyle tips.  

                                    Strictly return only the bullet points without extra text or explanations.  

                                    Glucose Data: ${JSON.stringify(formattedData)}
                                    `
                            }
                        ]
                    }
                ]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const insights = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No insights available.";
        console.log("✅ Sugar Intake Insights:", insights);

        return { insights };
    } catch (error) {
        console.error("❌ AI Analysis Error:", error.response?.data || error.message);
        return { error: "AI analysis failed. Try again later." };
    }
}

module.exports = router;
