import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/DiaBite/frontend/src/components/signup11/styless.css"

const Signup01 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <h2>👋 Welcome! Let's get started.</h2>
      <p>Tell us a little about yourself.</p>

      <label>What is your full name?</label>
      <input type="text" name="name" onChange={handleChange} placeholder="Enter your name" />

      <label>What is your email?</label>
      <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" />

      <label>Set a password</label>
      <input type="password" name="password" onChange={handleChange} placeholder="Choose a strong password" />

      <label>How old are you?</label>
      <input type="number" name="age" onChange={handleChange} placeholder="Your age" />

      <label>Select your gender:</label>
      <select name="gender" onChange={handleChange}>
        <option value="">Choose one</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <button onClick={() => navigate("/signup2", { state: formData })}>Next ➡️</button>
    </div>
  );
};

export default Signup01;
