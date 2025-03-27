import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Signup1 = () => {
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
    <div className="container">
      <h2>Sign Up - Step 1</h2>
      <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <input type="number" name="age" placeholder="Age" onChange={handleChange} />
      <select name="gender" onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <button onClick={() => navigate("/signup2", { state: formData })}>Next</button>
    </div>
  );
};

export default Signup1;
