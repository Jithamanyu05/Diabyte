import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styless.css";

const Signup02 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};

  const [formData, setFormData] = useState({
    fastingSugar: "",
    premealSugar: "",
    postmealSugar: "",
    mealType: "",
    dietaryPreference: "",
    diabetesType: "",
    ...prevData,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <div className="status-bar">
        <div className="status-step completed">Step 1: Basic Info</div>
        <div className="status-step active">Step 2: Health Details</div>
        <div className="status-step">Step 3: Preferences</div>
      </div>

      <div className="signup-box">
        <h2>🩺 Health Details</h2>

        <label>Diabetes Type:</label>
        <select name="diabetesType" onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="Gestational">Gestational</option>
        </select>

        <label>Fasting Sugar Level (mg/dL):</label>
        <input type="number" name="fastingSugar" onChange={handleChange} placeholder="e.g., 90" />

        <label>Pre-meal Sugar Level (mg/dL):</label>
        <input type="number" name="premealSugar" onChange={handleChange} placeholder="e.g., 110" />

        <label>Post-meal Sugar Level (mg/dL):</label>
        <input type="number" name="postmealSugar" onChange={handleChange} placeholder="e.g., 140" />

        <label>Meal Type:</label>
        <select name="mealType" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>

        <div className="button-group">
          <button onClick={() => navigate("/signup1")}>⬅️ Back</button>
          <button onClick={() => navigate("/signup3", { state: formData })}>➡️ Next</button>
        </div>
      </div>
    </div>
  );
};

export default Signup02;
