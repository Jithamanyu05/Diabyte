import React from "react";
import { Card, Spinner } from "react-bootstrap";
import { 
    FaCheckCircle, FaExclamationTriangle, FaHeartbeat, 
    FaRunning, FaUtensils, FaAngleDoubleRight 
} from "react-icons/fa";

const CGMAnalysis = ({ analysis }) => {
    if (!analysis) {
        return (
            <div className="text-center text-muted my-3">
                <Spinner animation="border" size="sm" className="me-2" /> Analyzing data...
            </div>
        );
    }

    return (
        <div className="mt-4">
            <h3 className="text-primary mb-0">📊 Health Analysis</h3>
            <Card className="p-0 border-0">
                <Card.Body className="px-3 py-1">
                    {analysis.error ? (
                        <p className="text-danger">{analysis.error}</p>
                    ) : (
                        <ul className="list-unstyled">
                            {analysis.insights?.split("*").map((point, index) => {
                                const trimmedPoint = point.trim();
                                if (!trimmedPoint) return null;

                                // Icon selection based on category
                                let icon = <FaAngleDoubleRight className="text-success me-2" />;
                                if (trimmedPoint.includes("Overall Analysis")) icon = <FaHeartbeat className="text-danger me-2" />;
                                if (trimmedPoint.includes("Potential Risks")) icon = <FaExclamationTriangle className="text-warning me-2" />;
                                if (trimmedPoint.includes("Personalized Insights")) icon = <FaUtensils className="text-primary me-2" />;
                                if (trimmedPoint.includes("exercise") || trimmedPoint.includes("physical activity")) icon = <FaRunning className="text-danger me-2" />;

                                // Headings like "Overall Analysis:", "Potential Risks:", "Personalized Insights:"
                                if (trimmedPoint.endsWith(":")) {
                                    return (
                                        <li key={index} className="fw-bold mt-3">
                                            {icon} {trimmedPoint}
                                            <ul className="ms-4"></ul>
                                        </li>
                                    );
                                }

                                // Sub-items with icons
                                return (
                                    <li key={index} className="ms-4">
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

export default CGMAnalysis;
