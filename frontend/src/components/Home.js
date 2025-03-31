import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">DiabetesCare</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <h1>Take Control of Your Diabetes</h1>
        <p>
          Your all-in-one solution for managing diabetes with smart tracking,
          personalized recommendations, and comprehensive health analytics.
        </p>
        <a href="#get-started" className="button">Get Started</a>
      </section>

      <section className="features" id="features">
        <h2>Smart Features for Better Management</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Sugar Tracking</h3>
            <p>Easy and accurate blood sugar monitoring with trend analysis and alerts.</p>
          </div>

          <div className="feature-card">
            <h3>Food Tracking</h3>
            <p>Track your meals through text or voice input with detailed nutritional information.</p>
          </div>

          <div className="feature-card">
            <h3>Nutritional Insights</h3>
            <p>Comprehensive database of food items with detailed sugar and nutritional content.</p>
          </div>

          <div className="feature-card">
            <h3>AI Recommendations</h3>
            <p>Smart meal suggestions based on your blood sugar levels and dietary preferences.</p>
          </div>

          <div className="feature-card">
            <h3>Personalized Management</h3>
            <p>Customized diabetes management plans tailored to your specific needs.</p>
          </div>

          <div className="feature-card">
            <h3>Analytics Dashboard</h3>
            <p>Detailed health analytics and progress tracking for better management.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Take Control of Your Health?</h2>
        <p>Join thousands of users who are successfully managing their diabetes with DiabetesCare.</p>
        <a href="#signup" className="button">Sign Up Now</a>
      </section>
    </div>
  );
}

export default Home;