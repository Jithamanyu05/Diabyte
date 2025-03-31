import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"}}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "40px" }}>
        <div style={{ padding: "10px 15px", background: "#4caf50", color: "white", borderRadius: "5px" }}>Step 1: Basic Info</div>
        <div style={{ padding: "10px 15px", background: "#ccc", color: "black", borderRadius: "5px" }}>Step 2: Health Details</div>
        <div style={{ padding: "10px 15px", background: "#ccc", color: "black", borderRadius: "5px" }}>Step 3: Preferences</div>
      </div>

      <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", width: "550px"}}>
        <h2 style={{ textAlign: "center" }}>👋 Welcome! Let's get started.</h2>

        <label style={{ fontWeight: "bold" }}>Full Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold" }}>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold" }}>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Choose a strong password" required style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold" }}>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Your age" required style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "1px solid #ccc" }} />

        <label style={{ fontWeight: "bold" }}>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">Choose one</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button onClick={() => { console.log(formData); navigate("/signup2", { state: formData }) }}
            style={{ backgroundColor: "#4caf50", color: "white", padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer" }}>Next ➡️</button>
        </div>
      </div>
    </div>
  );
};

export default Signup01;
