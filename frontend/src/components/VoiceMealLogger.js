import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import FoodTracking from "./FoodTracking";

const VoiceMealLogger = () => {
    const [userId, setUserId] = useState(null);
    const [mealType, setMealType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    // Monitor transcript updates for debugging
    useEffect(() => {
        // console.log("Updated Transcript:", transcript);
    }, [transcript]);

    // Function to extract user ID from JWT token
    const getUserIdFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            return payload.id; // Extract user ID
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    };

    // Fetch user ID from token stored in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const extractedUserId = getUserIdFromToken(storedToken);
            if (extractedUserId) {
                setUserId(extractedUserId);
            } else {
                console.warn("Invalid token format. Unable to extract user ID.");
            }
        } else {
            console.warn("No token found! Ensure user is logged in.");
        }
    }, []);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    // Push-to-Talk Handlers
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
            const response = await axios.post(
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
            console.error("Error logging meal:", error.response ? error.response.data : error.message);
            alert("Failed to log meal. Try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <div>
            <div
                style={{
                    maxWidth: "500px",
                    margin: "auto",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    textAlign: "center",
                    fontFamily: "'Poppins', sans-serif",
                }}
            >
                <h2 style={{ color: "dark", fontSize: "22px", marginBottom: "10px", fontWeight: "bold" }}>
                    🎙 Voice-Based Meal Logging
                </h2>

                <label
                    style={{
                        fontSize: "16px",
                        color: "black",
                        fontWeight: "600",
                        display: "block",
                        marginTop: "10px",
                    }}
                >
                    Meal Type:
                </label>
                <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "5px",
                        borderRadius: "8px",
                        border: "none",
                        outline: "none",
                        fontSize: "16px",
                        background: "rgba(255, 255, 255, 0.8)",
                        color: "#333",
                        fontWeight: "bold",
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
                            padding: "12px 20px",
                            fontSize: "16px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            background: listening ? "grey" : "black",
                            color: "white",
                            transition: "0.3s ease-in-out",
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
                    }}
                >
                    🔄 Reset
                </button>

                <p
                    style={{
                        marginTop: "15px",
                        background: "rgba(255, 255, 255, 0.7)",
                        padding: "10px",
                        borderRadius: "8px",
                        fontWeight: "500",
                        color: "#333",
                    }}
                >
                    <strong>📜 Recorded Text:</strong> {transcript}
                </p>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        background: isSubmitting ? "#ccc" : "#3498db",
                        color: "white",
                        fontSize: "16px",
                        padding: "10px 18px",
                        marginTop: "15px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        transition: "0.3s ease-in-out",
                    }}
                >
                    {isSubmitting ? "⌛ Submitting..." : "✅ Submit Meal"}
                </button>
            </div>
        </div>
    );
};

export default VoiceMealLogger;
