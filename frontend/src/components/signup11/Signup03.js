import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup03 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state ?? {};

  const [formData, setFormData] = useState({
    ...prevData,
    dietaryPreference: "",
    dailyCaloricIntake: "",
    foodAllergies: "",
    mealTypePreference: "",
    activityLevel: "",
    weight: "",
    height: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const finalData = {
        ...formData,
        foodAllergies: formData.foodAllergies.split(",").map((item) => item.trim()),
      };

      console.log("Final Form Data Sent to Backend:", finalData);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, finalData);

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Poppins, sans-serif"}}>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px",marginBottom:"40px"}}>
        <div style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#4CAF50", color: "white" }}>Step 1: Basic Info</div>
        <div style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#4CAF50", color: "white" }}>Step 2: Health Details</div>
        <div style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#2196F3", color: "white" }}>Step 3: Preferences</div>
      </div>

      <div style={{ width: "550px", padding: "30px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff"}}>
        <h2 style={{ textAlign: "center" }}>🎯 Final Touches</h2>
        
        <label style={{ fontWeight: "bold" }}>Daily Calorie Intake (kcal):</label>
        <input type="number" name="dailyCaloricIntake" onChange={handleChange} placeholder="e.g., 2000" style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
        
        <label style={{ fontWeight: "bold" }}>Food Allergies (if any):</label>
        <input type="text" name="foodAllergies" onChange={handleChange} placeholder="e.g., Nuts, Dairy" style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
        
        <label style={{ fontWeight: "bold" }}>Meal Type Preference:</label>
        <select name="mealTypePreference" onChange={handleChange} style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">Select</option>
          <option value="Indian">Indian</option>
          <option value="Japanese">Japanese</option>
          <option value="Chinese">Chinese</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Continental">Continental</option>
        </select>

        <label style={{ fontWeight: "bold" }}>Dietary Preference:</label>
        <select name="dietaryPreference" onChange={handleChange} style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">Select</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Keto">Keto</option>
          <option value="Paleo">Paleo</option>
          <option value="Omnivore">Omnivore</option>
        </select>

        <label style={{ fontWeight: "bold" }}>Activity Level:</label>
        <select name="activityLevel" onChange={handleChange} style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>

        <label style={{ fontWeight: "bold" }}>Height (cm):</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Your height in cm" required style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold" }}>Weight (kg):</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Your weight in kg" required style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button onClick={() => navigate("/signup2")} style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#ccc", border: "none", cursor: "pointer" }}>⬅️ Back</button>
          <button onClick={handleSubmit} style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>✅ Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Signup03;
