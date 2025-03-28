import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styless.css";

const Signup01 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-step active">Step 1: Basic Info</div>
        <div className="status-step">Step 2: Health Details</div>
        <div className="status-step">Step 3: Preferences</div>
      </div>

      <div className="signup-box">
        <h2>👋 Welcome! Let's get started.</h2>
        <p>Tell us a little about yourself.</p>

        <label>Full Name:</label>
        <input type="text" name="name" onChange={handleChange} placeholder="Enter your name" />

        <label>Email:</label>
        <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" />

        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} placeholder="Choose a strong password" />

        <label>Age:</label>
        <input type="number" name="age" onChange={handleChange} placeholder="Your age" />

        <label>Gender:</label>
        <select name="gender" onChange={handleChange}>
          <option value="">Choose one</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Height (cm):</label>
        <input type="number" name="height" onChange={handleChange} placeholder="Your height in cm" />

        <label>Weight (kg):</label>
        <input type="number" name="weight" onChange={handleChange} placeholder="Your weight in kg" />

        <div className="button-group">
          <button onClick={() => navigate("/signup2", { state: formData })}>Next ➡️</button>
        </div>
      </div>
    </div>
  );
};

export default Signup01;
