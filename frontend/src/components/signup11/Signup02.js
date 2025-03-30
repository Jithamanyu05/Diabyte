import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styless.css";

const Signup02 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};

  const [formData, setFormData] = useState({
    ...prevData,
    diabetesType: "",
    sugarLevels: [
      {
        mealType: "",
        fastingSugarLevel: "",
        preMealSugarLevel: "",
        postMealSugarLevel: "",
        date: new Date().toISOString(),
      },
    ]
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      sugarLevels: [
        {
          ...formData.sugarLevels[0],
          [e.target.name]: e.target.value,
        },
      ],
    });
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
        <select name="diabetesType" value={formData.diabetesType} onChange={(e) => setFormData({ ...formData, diabetesType: e.target.value })}>
          <option value="">Select Type</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="Gestational">Gestational</option>
        </select>

        <label>Meal Type:</label>
        <select name="mealType" value={formData.sugarLevels[0].mealType} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>

        <label>Fasting Sugar Level:</label>
        <input type="number" name="fastingSugarLevel" value={formData.sugarLevels[0].fastingSugarLevel} onChange={handleChange} required />

        <label>Pre-meal Sugar Level:</label>
        <input type="number" name="preMealSugarLevel" value={formData.sugarLevels[0].preMealSugarLevel} onChange={handleChange} required />

        <label>Post-meal Sugar Level:</label>
        <input type="number" name="postMealSugarLevel" value={formData.sugarLevels[0].postMealSugarLevel} onChange={handleChange} required />

        <div className="button-group">
          <button onClick={() => navigate("/signup1")}>⬅️ Back</button>
          <button onClick={() => {console.log(formData);navigate("/signup3", { state: formData })}}>➡️ Next</button>
        </div>
      </div>
    </div>
  );
};

export default Signup02;
