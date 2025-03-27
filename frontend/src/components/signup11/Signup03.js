import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "/DiaBite/frontend/src/components/signup11/styless.css"

const Signup03 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};

  const [formData, setFormData] = useState({
    activityLevel: "",
    weight: "",
    height: "",
    dailyCaloricIntake: "",
    mealTypePreference: "",
    foodAllergies: "",
    ...prevData,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/users/signup", formData);
      alert("🎉 Signup Complete!");
      navigate("/signin"); // Redirect to login
    } catch (error) {
      alert("❌ Error submitting data. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>🏃 Lifestyle & Preferences</h2>

      <label>Select your activity level:</label>
      <select name="activityLevel" onChange={handleChange}>
        <option value="">Choose one</option>
        <option value="Sedentary">Sedentary</option>
        <option value="Moderate">Moderate</option>
        <option value="Active">Active</option>
      </select>

      <label>What is your weight (kg)?</label>
      <input type="number" name="weight" onChange={handleChange} placeholder="Weight in kg" />

      <label>What is your height (cm)?</label>
      <input type="number" name="height" onChange={handleChange} placeholder="Height in cm" />

      <label>Daily caloric intake (kcal)?</label>
      <input type="number" name="dailyCaloricIntake" onChange={handleChange} placeholder="kcal" />

      <label>Preferred meal type:</label>
      <select name="mealTypePreference" onChange={handleChange}>
        <option value="">Choose one</option>
        <option value="Veg">Vegetarian</option>
        <option value="Non-Veg">Non-Vegetarian</option>
        <option value="Vegan">Vegan</option>
        <option value="Keto">Keto</option>
      </select>

      <label>Any food allergies?</label>
      <input type="text" name="foodAllergies" onChange={handleChange} placeholder="e.g., Peanuts, Dairy" />

      <button onClick={() => navigate("/signup2")}>⬅️ Back</button>
      <button onClick={handleSubmit}>✅ Submit</button>
    </div>
  );
};

export default Signup03;
