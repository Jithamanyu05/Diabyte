import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import FoodTracking from "./FoodTracking";

const VoiceMealLogger = () => {
    const [userId, setUserId] = useState(null);
    const [mealType, setMealType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    // Extract user ID from JWT token
    const getUserIdFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.id;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    };

    // Fetch user ID on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const extractedUserId = getUserIdFromToken(storedToken);
            if (extractedUserId) setUserId(extractedUserId);
        }
    }, []);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    // Speech recognition handlers
    const handlePushToTalkStart = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    };

    const handlePushToTalkEnd = () => {
        SpeechRecognition.stopListening();
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in. Please log in first.");
            return;
        }
        if (!mealType || !transcript.trim()) {
            alert("Please select meal type and record your voice input.");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/food/log/voice`,
                { mealType, voiceText: transcript },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Meal logged successfully!");
            resetTranscript();
        } catch (error) {
            console.error("Error logging meal:", error);
            alert("Failed to log meal. Try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <div
            style={{
                maxWidth: "500px",
                margin: "auto",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                textAlign: "center",
                fontFamily: "'Poppins', sans-serif",
                background: "#f9f9f9",
            }}
        >
            <h2 style={{ color: "#333", fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
                🎙 Voice-Based Meal Logging
            </h2>

            <label
                style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#444",
                    display: "block",
                    marginBottom: "5px",
                }}
            >
                Meal Type:
            </label>
            <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                    background: "#fff",
                    color: "#333",
                    fontWeight: "bold",
                    cursor: "pointer",
                }}
            >
                <option value="">Select</option>
                <option value="Breakfast">🍳 Breakfast</option>
                <option value="Lunch">🥗 Lunch</option>
                <option value="Dinner">🍽️ Dinner</option>
            </select>

            {/* Push-to-Talk Button */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onMouseDown={handlePushToTalkStart}
                    onMouseUp={handlePushToTalkEnd}
                    onTouchStart={handlePushToTalkStart}
                    onTouchEnd={handlePushToTalkEnd}
                    style={{
                        padding: "12px 22px",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        background: listening ? "#d9534f" : "#0275d8",
                        color: "white",
                        transition: "0.3s ease-in-out",
                        boxShadow: listening ? "0 4px 10px rgba(217, 83, 79, 0.3)" : "0 4px 10px rgba(2, 117, 216, 0.3)",
                    }}
                >
                    {listening ? "🎤 Recording..." : "Press & Hold to Talk"}
                </button>
            </div>

            <button
                onClick={resetTranscript}
                style={{
                    marginTop: "15px",
                    padding: "10px 16px",
                    fontSize: "14px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    background: "#f39c12",
                    color: "white",
                    transition: "0.3s ease-in-out",
                    boxShadow: "0px 4px 8px rgba(243, 156, 18, 0.4)",
                }}
            >
                🔄 Reset
            </button>

            <p
                style={{
                    marginTop: "15px",
                    background: "rgba(255, 255, 255, 0.9)",
                    padding: "12px",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#333",
                    border: "1px solid #ccc",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
            >
                <strong>📜 Recorded Text:</strong> {transcript || "No input yet"}
            </p>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                    background: isSubmitting ? "#ccc" : "#28a745",
                    color: "white",
                    fontSize: "16px",
                    padding: "12px 20px",
                    marginTop: "15px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    transition: "0.3s ease-in-out",
                    boxShadow: isSubmitting ? "none" : "0px 4px 8px rgba(40, 167, 69, 0.4)",
                }}
            >
                {isSubmitting ? "⌛ Submitting..." : " Submit Meal"}
            </button>
        </div>
    );
};

export default VoiceMealLogger;
