import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

const Signup2 = () => {
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
    <div className="container">
      <h2>Sign Up - Step 2</h2>
      <select name="diabetesType" onChange={handleChange}>
        <option value="">Select Diabetes Type</option>
        <option value="Type 1">Type 1</option>
        <option value="Type 2">Type 2</option>
        <option value="Gestational">Gestational</option>
      </select>
      <input type="number" name="fastingSugarLevel" placeholder="Fasting Sugar Level" onChange={handleChange} />
      <input type="number" name="preMealSugarLevel" placeholder="Pre-Meal Sugar Level" onChange={handleChange} />
      <input type="number" name="postMealSugarLevel" placeholder="Post-Meal Sugar Level" onChange={handleChange} />
      <input type="text" name="dietaryPreference" placeholder="Dietary Preference" onChange={handleChange} />
      <button onClick={() => navigate("/")}>Back</button>
      <button onClick={() => navigate("/signup3", { state: formData })}>Next</button>
    </div>
  );
};

export default Signup2;
