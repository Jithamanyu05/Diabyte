import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios
import "./styless.css";

const Signup03 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};  // Get previous form data

  // State to hold the final step form data
  const [formData, setFormData] = useState({
    activityLevel: "",
    weight: "",
    height: "",
    dailyCaloricIntake: "",
    mealTypePreference: "",
    foodAllergies: "",
    ...prevData,  // Add the previous data from earlier steps
  });

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission and send the data to the server
  const handleSubmit = async () => {
    try {
      // Send the final form data to your backend API
      const response = await axios.post("http://localhost:5000/users/signup", formData);
      console.log("User registered:", response.data);
      alert("Signup Complete! Check console for submitted data.");
      navigate("/signin");  // Redirect to the login page after successful signup
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Sign Up - Step 3</h2>

      {/* Input fields */}
      <select name="activityLevel" onChange={handleChange}>
        <option value="">Select Activity Level</option>
        <option value="Sedentary">Sedentary</option>
        <option value="Moderate">Moderate</option>
        <option value="Active">Active</option>
      </select>

      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        onChange={handleChange}
      />
      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        onChange={handleChange}
      />
      <input
        type="number"
        name="dailyCaloricIntake"
        placeholder="Daily Caloric Intake"
        onChange={handleChange}
      />
      <input
        type="text"
        name="mealTypePreference"
        placeholder="Meal Type Preference"
        onChange={handleChange}
      />
      <input
        type="text"
        name="foodAllergies"
        placeholder="Food Allergies (comma-separated)"
        onChange={handleChange}
      />

      {/* Navigation buttons */}
      <button onClick={() => navigate("/signup2")}>Back</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Signup03;
