import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    ],
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Poppins, sans-serif"}}>
      {/* Status Bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "40px" }}>
        <div style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#4CAF50", color: "white" }}>Step 1: Basic Info</div>
        <div style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#2196F3", color: "white" }}>Step 2: Health Details</div>
        <div style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#ddd", color: "black" }}>Step 3: Preferences</div>
      </div>

      {/* Form Box */}
      <div style={{ width: "550px", padding: "30px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff"}}>
        <h2 style={{ textAlign: "center" }}>🩺 Health Details</h2>

        <label style={{ fontWeight: "bold" }}>Diabetes Type:</label>
        <select name="diabetesType" value={formData.diabetesType} onChange={(e) => setFormData({ ...formData, diabetesType: e.target.value })} 
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">Select Type</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="Gestational">Gestational</option>
        </select>

        <label style={{ fontWeight: "bold" }}>Meal Type:</label>
        <select name="mealType" value={formData.sugarLevels[0].mealType} onChange={handleChange} 
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">Select</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>

        <label style={{ fontWeight: "bold" }}>Fasting Sugar Level:</label>
        <input type="number" name="fastingSugarLevel" value={formData.sugarLevels[0].fastingSugarLevel} onChange={handleChange} required 
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold" }}>Pre-meal Sugar Level:</label>
        <input type="number" name="preMealSugarLevel" value={formData.sugarLevels[0].preMealSugarLevel} onChange={handleChange} required 
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold" }}>Post-meal Sugar Level:</label>
        <input type="number" name="postMealSugarLevel" value={formData.sugarLevels[0].postMealSugarLevel} onChange={handleChange} required 
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button onClick={() => navigate("/signup1")} 
            style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#ccc", border: "none", cursor: "pointer" }}>⬅️ Back</button>
          <button onClick={() => { console.log(formData); navigate("/signup3", { state: formData }) }} 
            style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#2196F3", color: "white", border: "none", cursor: "pointer" }}>➡️ Next</button>
        </div>
      </div>
    </div>
  );
};

export default Signup02;
