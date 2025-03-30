import React from "react";
import { Card, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle, FaHeartbeat, FaRunning, FaUtensils, FaAngleDoubleRight } from "react-icons/fa";

const CGMAnalysis = ({ analysis }) => {
  if (!analysis) {
    return (
      <div style={styles.spinnerContainer}>
        <Spinner animation="border" size="sm" style={styles.spinner} /> 
        <span style={styles.spinnerText}>Analyzing data...</span>
      </div>
    );
  }

  return (
    <div style={styles.analysisContainer}>
      <h3 style={styles.analysisHeading}>📊 Health Analysis</h3>
      <Card style={styles.analysisCard}>
        <Card.Body style={styles.cardBody}>
          {analysis.error ? (
            <p style={styles.errorText}>{analysis.error}</p>
          ) : (
            <ul style={styles.list}>
              {analysis.insights?.split("*").map((point, index) => {
                const trimmedPoint = point.trim();
                if (!trimmedPoint) return null;

                // Choose icon based on category keywords
                let icon = <FaAngleDoubleRight style={styles.icon} />;
                if (trimmedPoint.includes("Overall Analysis")) icon = <FaHeartbeat style={{ ...styles.icon, color: "#dc3545" }} />;
                if (trimmedPoint.includes("Potential Risks")) icon = <FaExclamationTriangle style={{ ...styles.icon, color: "#ffc107" }} />;
                if (trimmedPoint.includes("Personalized Insights")) icon = <FaUtensils style={{ ...styles.icon, color: "#007bff" }} />;
                if (trimmedPoint.includes("exercise") || trimmedPoint.includes("physical activity")) icon = <FaRunning style={{ ...styles.icon, color: "#dc3545" }} />;

                return (
                  <li key={index} style={trimmedPoint.endsWith(":") ? styles.headingItem : styles.subItem}>
                    {icon} {trimmedPoint}
                  </li>
                );
              })}
            </ul>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

const styles = {
  spinnerContainer: {
    textAlign: "center",
    color: "#6c757d",
    margin: "20px 0"
  },
  spinner: {
    marginRight: "8px"
  },
  spinnerText: {
    fontSize: "14px"
  },
  analysisContainer: {
    marginTop: "20px"
  },
  analysisHeading: {
    color: "#007bff",
    textAlign: "center",
    marginBottom: "10px"
  },
  analysisCard: {
    padding: "0",
    border: "none"
  },
  cardBody: {
    padding: "10px 15px"
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  headingItem: {
    fontWeight: "bold",
    marginTop: "12px",
    fontSize: "15px"
  },
  subItem: {
    marginLeft: "20px",
    fontSize: "14px",
    marginTop: "6px"
  },
  icon: {
    marginRight: "8px",
    color: "#28a745"
  },
  errorText: {
    color: "#dc3545",
    fontSize: "14px"
  }
};

export default CGMAnalysis;
