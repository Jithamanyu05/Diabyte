import axios from "axios";
import React, { useState, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

function AiRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const promptRef = useRef(null);

  async function generateRecommendations() {
    const prompt = promptRef.current.value.trim();
    if (!prompt) {
      alert("Please enter a prompt before generating recommendations!");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/ai-recom/ai-recommendations",
        { prompt },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setRecommendations([
        ...recommendations,
        { user: prompt, ai: res.data.recommendation },
      ]);
      promptRef.current.value = "";
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setErrorMessage("Failed to generate recommendations. Please try again later.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  }

  // Inline styles for the component
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Poppins', sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "1rem",
      color: "#333",
    },
    chatWindow: {
      height: "400px",
      overflowY: "auto",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #ffffff, #f0f4f8)",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      padding: "1rem",
      marginBottom: "1rem",
      border: "1px solid #e0e0e0",
    },
    userMessage: {
      backgroundColor: "#d1e7dd",
      color: "#0f5132",
      padding: "0.5rem 1rem",
      borderRadius: "15px",
      maxWidth: "70%",
      marginLeft: "auto",
      marginBottom: "0.5rem",
    },
    aiMessage: {
      backgroundColor: "#fff",
      border: "1px solid #ced4da",
      padding: "0.5rem 1rem",
      borderRadius: "15px",
      maxWidth: "70%",
      marginBottom: "0.5rem",
    },
    textarea: {
      width: "100%",
      borderRadius: "8px",
      border: "1px solid #ced4da",
      padding: "0.75rem",
      fontSize: "1rem",
      resize: "vertical",
      marginBottom: "1rem",
    },
    generateButton: {
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "8px",
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#fff",
      cursor: "pointer",
      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    },
    spinnerContainer: {
      textAlign: "center",
      marginTop: "1rem",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      {/* Error Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#dc3545", color: "#fff" }}
        >
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 style={styles.header}>Personal AI Assistant</h2>

      {loading && (
        <div style={styles.spinnerContainer}>
          <Spinner animation="border" variant="primary" />
          <p>Generating recommendation...</p>
        </div>
      )}

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {recommendations.length === 0 ? (
          <p className="text-muted" style={{ textAlign: "center" }}>
            Please enter your prompt and click "Generate!" to see recommendations.
          </p>
        ) : (
          recommendations.map((item, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <div style={styles.userMessage}>{item.user}</div>
              <div style={styles.aiMessage}>
                <ReactMarkdown>{item.ai}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Prompt Input */}
      <textarea
        ref={promptRef}
        style={styles.textarea}
        rows="3"
        placeholder="Enter your dietary preferences..."
      />

      {/* Generate Button */}
      <Button style={styles.generateButton} onClick={generateRecommendations}>
        Generate!
      </Button>
    </div>
  );
}

export default AiRecommendations;
