import React, { useState, useEffect } from "react";
import axios from "axios";
import CGMAnalysis from "./CGMAnalysis";
import { Modal,Form, Button, Alert, Card, Container, Row, Col, Table } from "react-bootstrap";
import { FaUtensils, FaHeartbeat, FaCalendarAlt, FaHistory,FaInfoCircle ,FaCheckCircle,FaExclamationTriangle,FaTimesCircle} from "react-icons/fa";

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
    const [history, setHistory] = useState([]); // Store sugar level history

    useEffect(() => {
        fetchAnalysis();
        fetchHistory();
    }, []);

    // Fetch AI Analysis when the component loads
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

    // Fetch Sugar Level History
    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return console.error("No token found, user must log in.");

            const response = await axios.get("http://localhost:5000/cgm/history", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setHistory(response.data); // Store the retrieved history data
        } catch (error) {
            console.error("Error fetching history:", error.response?.data || error.message);
        }
    };

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submission
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
            fetchHistory(); // Refresh history after submitting new data
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

                    <Button className="mt-4 w-100" variant="primary" type="submit">
                        📩 Submit Data
                    </Button>
                </Form>
            </Card>
            {analysis && <CGMAnalysis analysis={analysis} />}
            </div>
            
            <div className=" p-3 w-100 mt-4">
            {history.length > 0 && (
                <Card className=" border-0 mt-2 w-100 position-relative">
                    {/* Sugar Guide Button - Positioned on Top Right */}
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
                    <FaInfoCircle  className="rounded p-0"/>
                </Button>


                    {/* Gradient Header */}
                    <div className="mb-3 text-dark text-center rounded-top">
                        <h4 className="fw-bold">
                            <FaHistory className="me-2" /> Sugar Level History
                        </h4>
                    </div>

                    {/* Scrollable Table for Small Screens */}
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
                                        <td>{new Date(entry.date).toLocaleDateString("en-US", { 
                                            year: "numeric", 
                                            month: "long", 
                                            day: "numeric" 
                                        })}</td>
                                        <td>{entry.mealType}</td>

                                        {/* Fasting Sugar Level */}
                                        <td>
                                            <span className={`badge 
                                                ${entry.fastingSugarLevel < 100 ? "bg-success" : 
                                                entry.fastingSugarLevel <= 125 ? "bg-warning" : "bg-danger"}`}>
                                                {entry.fastingSugarLevel} mg/dL
                                            </span>
                                        </td>

                                        {/* Pre-Meal Sugar Level */}
                                        <td>
                                            <span className={`badge 
                                                ${entry.preMealSugarLevel < 72 ? "bg-danger" : 
                                                entry.preMealSugarLevel <= 99 ? "bg-success" : 
                                                entry.preMealSugarLevel <= 130 ? "bg-warning" : "bg-danger"}`}>
                                                {entry.preMealSugarLevel} mg/dL
                                            </span>
                                        </td>

                                        {/* Post-Meal Sugar Level */}
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

            {/* Bootstrap Modal for Sugar Level Guide */}
            <Modal  show={showGuide} onHide={() => setShowGuide(false)} centered>
    <Modal.Header closeButton className="text-black border-0 shadow-sm">
        <Modal.Title className="d-flex align-items-center">
            <FaInfoCircle className="me-2 text-info" /> Sugar Level Guide
        </Modal.Title>
    </Modal.Header>
    
    <Modal.Body className="p-4">
        <Card className="p-3 border-0 rounded-3">
            <div className="table-responsive" style={{ maxHeight: '400px', maxWidth:"800px"}}>
                <Table striped bordered hover className="text-center align-middle shadow-sm rounded w-100">
                    <thead className="text-white">
                        <tr>
                            <th className="p-3">Measurement</th>
                            <th className="p-3 ">Normal 🟢</th>
                            <th className="p-3">Warning <br />🟡</th>
                            <th className="p-3">Risk <br />🔴</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-3" style={{fontSize:"0.9rem"}}><b>Fasting Sugar</b></td>
                            <td><span className="badge bg-success d-block p-2 shadow-sm">Below 100</span></td>
                            <td><span className="badge bg-warning d-block p-2 shadow-sm">100 - 125</span></td>
                            <td><span className="badge bg-danger d-block p-2 shadow-sm">126+</span></td>
                        </tr>
                        <tr>
                            <td className="p-3" style={{fontSize:"0.89rem"}}><b>Pre-Meal Sugar</b></td>
                            <td><span className="badge bg-success d-block p-2 shadow-sm">72 - 99</span></td>
                            <td><span className="badge bg-warning d-block p-2 shadow-sm">80 - 130 (Diabetic)</span></td>
                            <td><span className="badge bg-danger d-block p-2 shadow-sm">&lt; 72 or &gt; 130</span></td>
                        </tr>
                        <tr>
                            <td className="p-3" style={{fontSize:"0.84rem"}}>
                                <b>Post-Meal Sugar</b><br />
                                <small className="text-muted">(2 hrs after meal)</small>
                            </td>
                            <td><span className="badge bg-success d-block p-2 shadow-sm">Below 140</span></td>
                            <td><span className="badge bg-warning d-block p-2 shadow-sm">140 - 180</span></td>
                            <td><span className="badge bg-danger d-block p-2 shadow-sm">Above 180</span></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Card>
    </Modal.Body>
    
    <Modal.Footer className="border-0 d-flex justify-content-center">
        <Button 
            variant="secondary" 
            className="px-4 py-2 shadow-sm rounded-pill"
            style={{ transition: "all 0.3s ease-in-out", backgroundColor: "#6c757d", border: "none" }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6268"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#6c757d"}
            onClick={() => setShowGuide(false)}
        >
            Close
        </Button>
    </Modal.Footer>
</Modal>



        </div>

            

        
        </Container>
    );
};

export default CGMForm;
