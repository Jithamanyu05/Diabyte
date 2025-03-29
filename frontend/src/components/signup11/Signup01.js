import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styless.css";

const Signup01 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: `USR${Math.floor(Math.random() * 100000)}`, // Generate a random userId
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
      <div className="status-bar">
        <div className="status-step active">Step 1: Basic Info</div>
        <div className="status-step">Step 2: Health Details</div>
        <div className="status-step">Step 3: Preferences</div>
      </div>

      <div className="signup-box">
        <h2>👋 Welcome! Let's get started.</h2>

        <label>Full Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Choose a strong password" required />

        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Your age" required />

        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Choose one</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Height (cm):</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Your height in cm" required />

        <label>Weight (kg):</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Your weight in kg" required />

        <div className="button-group">
          <button onClick={() => navigate("/signup2", { state: formData })}>Next ➡️</button>
        </div>
      </div>
    </div>
  );
};

export default Signup01;
