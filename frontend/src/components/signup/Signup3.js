import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

const Signup3 = () => {
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

  const handleSubmit = () => {
    console.log("Final Submitted Data:", formData);
    alert("Signup Complete! Check console for submitted data.");
  };

  return (
    <div className="container">
      <h2>Sign Up - Step 3</h2>
      <select name="activityLevel" onChange={handleChange}>
        <option value="">Select Activity Level</option>
        <option value="Sedentary">Sedentary</option>
        <option value="Moderate">Moderate</option>
        <option value="Active">Active</option>
      </select>
      <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} />
      <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} />
      <input type="number" name="dailyCaloricIntake" placeholder="Daily Caloric Intake" onChange={handleChange} />
      <input type="text" name="mealTypePreference" placeholder="Meal Type Preference" onChange={handleChange} />
      <input type="text" name="foodAllergies" placeholder="Food Allergies (comma-separated)" onChange={handleChange} />
      <button onClick={() => navigate("/signup2")}>Back</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Signup3;
