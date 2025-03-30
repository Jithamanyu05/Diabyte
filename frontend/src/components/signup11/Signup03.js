import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styless.css";

const Signup03 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state ?? {}; // Ensure prevData is at least an empty object

  const [formData, setFormData] = useState({
    ...prevData,
    dietaryPreference: "",  
    dailyCaloricIntake: "",
    foodAllergies: "",
    mealTypePreference: "",
    activityLevel: "",      
    weight:"",
    height:""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const finalData = {
        ...formData,
        foodAllergies: formData.foodAllergies.split(",").map((item) => item.trim()), // Convert string to array
      };

      console.log("Final Form Data Sent to Backend:", finalData);

      const response = await axios.post("http://localhost:5000/users/signup", finalData);

      if (response.status === 201) {
        alert("🎉 Signup Complete! Your details have been saved.");
        navigate("/signin");
      } else {
        alert("⚠️ Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("❌ Error signing up. Check console for details.");
    }
  };

  return (
    <div className="signup-container">
      <div className="status-bar">
        <div className="status-step completed">Step 1: Basic Info</div>
        <div className="status-step completed">Step 2: Health Details</div>
        <div className="status-step active">Step 3: Preferences</div>
      </div>

      <div className="signup-box">
        <h2>🎯 Final Touches</h2>

        <label>Daily Calorie Intake (kcal):</label>
        <input type="number" name="dailyCaloricIntake" onChange={handleChange} placeholder="e.g., 2000" />

        <label>Food Allergies (if any):</label>
        <input type="text" name="foodAllergies" onChange={handleChange} placeholder="e.g., Nuts, Dairy" />

        <label>Meal Type Preference:</label>
        <select name="mealTypePreference" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Indian">Indian</option>
          <option value="Japanese">Japanese</option>
          <option value="Chinese">Chinese</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Continental">Continental</option>
        </select>

        <label>Dietary Preference:</label>
        <select name="dietaryPreference" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Keto">Keto</option>
          <option value="Paleo">Paleo</option>
          <option value="Omnivore">Omnivore</option>
        </select>

        <label>Activity Level:</label>
        <select name="activityLevel" onChange={handleChange}>
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>

        <label>Height (cm):</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Your height in cm" required />

        <label>Weight (kg):</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Your weight in kg" required />

        <div className="button-group">
          <button onClick={() => navigate("/signup2")}>⬅️ Back</button>
          <button onClick={handleSubmit}>✅ Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Signup03;
