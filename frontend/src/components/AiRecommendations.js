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
      const res = await axios.post("http://localhost:5000/ai-recom/ai-recommendations", 
        { prompt },
        {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },}
    );

      setRecommendations([...recommendations, { user: prompt, ai: res.data.recommendation }]);
      promptRef.current.value = "";
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setErrorMessage("Failed to generate recommendations. Please try again later.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      {/* Error Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {loading && (
          <div className="text-center mt-3">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-dark">Generating recommendation...</p>
          </div>
        )}
      {/* Chat Window */}
      <div className="chat-window border p-3 mb-3 bg-light" style={{ height: "400px", overflowY: "auto", borderRadius: "10px" }}>
        {recommendations.length === 0 ? (
          <p className="text-muted">
            Please click the button for generating recommendations by giving
            a prompt containing your preferences,if you dont have any just click
            generate and see the magic happen!
          </p>
        ) : (
          recommendations.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="user-message bg-white text-dark p-2 rounded mb-2 text-end">
                {item.user}
              </div>
              <div className="ai-message bg-white border p-2 rounded">
              <ReactMarkdown>{item.ai}</ReactMarkdown>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        
      </div>

      {/* Prompt Input */}
      <textarea
        ref={promptRef}
        className="form-control mb-3"
        rows="3"
        placeholder="Enter your dietary preferences..."
      />

      {/* Generate Button */}
      <Button variant="primary" onClick={generateRecommendations}>
        Generate!
      </Button>
    </div>
  );
}

export default AiRecommendations;
