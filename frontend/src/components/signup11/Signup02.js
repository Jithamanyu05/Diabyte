import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "/DiaBite/frontend/src/components/signup11/styless.css"
const Signup02 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};

  const [formData, setFormData] = useState({
    diabetesType: "",
    fastingSugarLevel: "",
    preMealSugarLevel: "",
    postMealSugarLevel: "",
    dietaryPreference: "",
    ...prevData,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <h2>🔬 Let's talk about your health.</h2>
      <p>This will help us provide better recommendations.</p>

      <label>What type of diabetes do you have?</label>
      <select name="diabetesType" onChange={handleChange}>
        <option value="">Choose one</option>
        <option value="Type 1">Type 1</option>
        <option value="Type 2">Type 2</option>
        <option value="Gestational">Gestational</option>
      </select>

      <label>What is your fasting sugar level?</label>
      <input type="number" name="fastingSugarLevel" onChange={handleChange} placeholder="mg/dL" />

      <label>What is your pre-meal sugar level?</label>
      <input type="number" name="preMealSugarLevel" onChange={handleChange} placeholder="mg/dL" />

      <label>What is your post-meal sugar level?</label>
      <input type="number" name="postMealSugarLevel" onChange={handleChange} placeholder="mg/dL" />

      <label>Any dietary preferences?</label>
      <input type="text" name="dietaryPreference" onChange={handleChange} placeholder="e.g., Vegetarian, Vegan, Keto" />

      <button onClick={() => navigate("/signup1")}>⬅️ Back</button>
      <button onClick={() => navigate("/signup3", { state: formData })}>Next ➡️</button>
    </div>
  );
};

export default Signup02;
