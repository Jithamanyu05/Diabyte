import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

const VoiceMealLogger = () => {
    const [userId, setUserId] = useState(null);
    const [mealType, setMealType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);


    // Ensure transcript updates
    useEffect(() => {
        console.log("Transcript updated:", transcript);
    }, [transcript]);

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

    

    const handlePushToTalkStart = () => {
        if (!isListening) {
            resetTranscript(); // Clear previous transcript
            setIsListening(true);
            SpeechRecognition.startListening({ continuous: true, language: "en-US" });
        }
    };

    const handlePushToTalkEnd = () => {
        if (isListening) {
            SpeechRecognition.stopListening();
            setIsListening(false);
        }
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
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                textAlign: "center",
                fontFamily: "'Poppins', sans-serif",
                background: "#ffffff",
                border: "1px solid #ddd",
            }}
        >
            <h2 style={{ color: "#2c3e50", fontSize: "22px", fontWeight: "bold", marginBottom: "20px" }}>
                🎙 Voice-Based Meal Logging
            </h2>

            {/* Meal Type Dropdown */}
            <label
                style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#444",
                    display: "block",
                    marginBottom: "8px",
                }}
            >
                Meal Type:
            </label>
            <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                    background: "#fff",
                    color: "#333",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <option value="">Select Meal Type</option>
                <option value="Breakfast">🍳 Breakfast</option>
                <option value="Lunch">🥗 Lunch</option>
                <option value="Dinner">🍽️ Dinner</option>
            </select>

            {/* Buttons Section */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                {/* Push-to-Talk Button */}
                <button
                    onMouseDown={handlePushToTalkStart}
                    onMouseUp={handlePushToTalkEnd}
                    onTouchStart={handlePushToTalkStart}
                    onTouchEnd={handlePushToTalkEnd}
                    style={{
                        flex: 1,
                        padding: "12px 18px",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        background: isListening ? "#d9534f" : "#0275d8",
                        color: "white",
                        transition: "0.3s",
                        boxShadow: isListening
                            ? "0 4px 10px rgba(217, 83, 79, 0.3)"
                            : "0 4px 10px rgba(2, 117, 216, 0.3)",
                    }}
                >
                    {isListening ? "🎤 Recording..." : "Press & Hold to Talk"}
                </button>

                {/* Reset Button */}
                <button
                    onClick={resetTranscript}
                    style={{
                        marginLeft: "10px",
                        flex: 1,
                        padding: "12px 16px",
                        fontSize: "14px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        background: "#f39c12",
                        color: "white",
                        transition: "0.3s",
                        boxShadow: "0px 4px 8px rgba(243, 156, 18, 0.4)",
                    }}
                >
                    🔄 Reset
                </button>
            </div>

            {/* Recorded Text Display */}
            <p
                style={{
                    marginTop: "18px",
                    background: "#f8f9fa",
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

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                    width: "100%",
                    background: isSubmitting ? "#ccc" : "#28a745",
                    color: "white",
                    fontSize: "16px",
                    padding: "12px 20px",
                    marginTop: "15px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    transition: "0.3s",
                    boxShadow: isSubmitting ? "none" : "0px 4px 8px rgba(40, 167, 69, 0.4)",
                }}
            >
                {isSubmitting ? "⌛ Submitting..." : "Submit Meal"}
            </button>
        </div>
    );
};

export default VoiceMealLogger;
