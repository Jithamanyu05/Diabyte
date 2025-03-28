import React, { useState, useEffect } from "react";
import axios from "axios";
import CGMAnalysis from "./CGMAnalysis";
import { Modal, Form, Button, Alert, Card, Container, Row, Col, Table } from "react-bootstrap";
import { FaUtensils, FaHeartbeat, FaCalendarAlt, FaHistory, FaInfoCircle } from "react-icons/fa";


const CGMForm = () => {

  const [showGuide, setShowGuide] = useState(false);
  const [formData, setFormData] = useState({
    mealType: "",
    fastingSugarLevel: "",
    preMealSugarLevel: "",
    postMealSugarLevel: "",
    date: ""
  });
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchAnalysis();
      fetchHistory();
    } else {
      setIsLoggedIn(false);
      setMessage("Please log in to view and track your sugar levels");
    }
  }, []);

  const fetchAnalysis = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found, user must log in.");

      const response = await axios.get("http://localhost:5000/cgm/analyze", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching analysis:", error.response?.data || error.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found, user must log in.");

      const response = await axios.get("http://localhost:5000/cgm/history", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found, user must log in.");

      const response = await axios.post(
        "http://localhost:5000/cgm/save",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setAnalysis(response.data.analysis);
      fetchHistory();
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error.message);
    }
  };

  return (
    <Container className="d-flex flex-column gap-4 justify-content-center align-items-center mt-4">
      <div className="d-flex gap-2 justify-content-center align-items-center mt-4">
        <Card className="p-4 bg-light" style={{ width: "40rem" }}>
          <h2 className="text-center mb-4 text-primary">Sugar Level Tracking</h2>

          {message && <Alert variant="success" className="text-center">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="mealType">
                  <Form.Label><FaUtensils className="me-2" />Meal Type</Form.Label>
                  <Form.Control type="text" name="mealType" value={formData.mealType} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="date">
                  <Form.Label><FaCalendarAlt className="me-2" />Date</Form.Label>
                  <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={4}>
                <Form.Group controlId="fastingSugarLevel">
                  <Form.Label><FaHeartbeat className="me-2" />Fasting Sugar</Form.Label>
                  <Form.Control type="number" name="fastingSugarLevel" value={formData.fastingSugarLevel} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="preMealSugarLevel">
                  <Form.Label><FaHeartbeat className="me-2" />Pre-Meal Sugar</Form.Label>
                  <Form.Control type="number" name="preMealSugarLevel" value={formData.preMealSugarLevel} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="postMealSugarLevel">
                  <Form.Label><FaHeartbeat className="me-2" />Post-Meal Sugar</Form.Label>
                  <Form.Control type="number" name="postMealSugarLevel" value={formData.postMealSugarLevel} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Button className="mt-4 w-100" variant="primary" type="submit" disabled={!isLoggedIn}>
              📩 Submit Data
            </Button>
          </Form>
        </Card>
        {analysis && <CGMAnalysis analysis={analysis} />}
      </div>

      <div className="p-3 w-100 mt-4">
        {history.length > 0 && (
          <Card className="border-0 mt-2 w-100 position-relative">
            <Button
              variant="info"
              className="position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center shadow border-0"
              onClick={() => setShowGuide(true)}
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#138496",
                color: "white",
                transition: "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#117a8b"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#138496"}
              onMouseDown={(e) => e.target.style.transform = "scale(0.9)"}
              onMouseUp={(e) => e.target.style.transform = "scale(1)"}
            >
              <FaInfoCircle className="rounded p-0" />
            </Button>

            <div className="mb-3 text-dark text-center rounded-top">
              <h4 className="fw-bold">
                <FaHistory className="me-2" /> Sugar Level History
              </h4>
            </div>

            <div className="table-responsive">
              <Table striped bordered hover className="mt-3 shadow-sm rounded">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Date</th>
                    <th>Meal Type</th>
                    <th>Fasting Sugar</th>
                    <th>Pre-Meal Sugar</th>
                    <th>Post-Meal Sugar</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                      <td>{entry.mealType}</td>

                      <td>
                        <span className={`badge 
                          ${entry.fastingSugarLevel < 100 ? "bg-success" : 
                          entry.fastingSugarLevel <= 125 ? "bg-warning" : "bg-danger"}`}>
                          {entry.fastingSugarLevel} mg/dL
                        </span>
                      </td>

                      <td>
                        <span className={`badge 
                          ${entry.preMealSugarLevel < 72 ? "bg-danger" : 
                          entry.preMealSugarLevel <= 99 ? "bg-success" : 
                          entry.preMealSugarLevel <= 130 ? "bg-warning" : "bg-danger"}`}>
                          {entry.preMealSugarLevel} mg/dL
                        </span>
                      </td>

                      <td>
                        <span className={`badge 
                          ${entry.postMealSugarLevel < 140 ? "bg-success" : 
                          entry.postMealSugarLevel <= 180 ? "bg-warning" : "bg-danger"}`}>
                          {entry.postMealSugarLevel} mg/dL
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      <Modal 
        show={showGuide} 
        onHide={() => setShowGuide(false)} 
        centered 
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">Help Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This section allows you to log your sugar levels for better tracking and monitoring of your diabetes. You can input the date, meal type, and sugar levels (fasting, pre-meal, post-meal). Once data is submitted, the AI analysis will provide insights based on your sugar levels.
          </p>

          <table className="table">
            <thead>
              <tr>
                <th>Measurement</th>
                <th>Good (Normal)</th>
                <th>Moderate</th>
                <th>Dangerous</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fasting Blood Sugar</td>
                <td style={{ backgroundColor: '#A8E6CF' }}>Less than 100 mg/dL (5.6 mmol/L)</td>
                <td style={{ backgroundColor: '#FFE0B2' }}>100 to 125 mg/dL (5.6 to 6.9 mmol/L)</td>
                <td style={{ backgroundColor: '#FF8A80' }}>126 mg/dL (7.0 mmol/L) or higher</td>
              </tr>
              <tr>
                <td>Pre-Meal Blood Sugar (Before eating)</td>
                <td style={{ backgroundColor: '#A8E6CF' }}>80 to 130 mg/dL</td>
                <td style={{ backgroundColor: '#FFE0B2' }}>Values outside of the target range, but not yet in the dangerous zone</td>
                <td style={{ backgroundColor: '#FF8A80' }}>Values outside of the target range, especially if consistently high</td>
              </tr>
              <tr>
                <td>Post-Meal Blood Sugar (2 hours after eating)</td>
                <td style={{ backgroundColor: '#A8E6CF' }}>Less than 140 mg/dL</td>
                <td style={{ backgroundColor: '#FFE0B2' }}>Values outside of the target range, but not yet in the dangerous zone</td>
                <td style={{ backgroundColor: '#FF8A80' }}>180 mg/dL or higher within 2 hours of eating</td>
              </tr>
            </tbody>
          </table>

          <div className="text-center">
            <Button variant="secondary" onClick={() => setShowGuide(false)}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CGMForm;