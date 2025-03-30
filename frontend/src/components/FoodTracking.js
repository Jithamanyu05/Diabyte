import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Container, Row, Col, Form, Button, Alert, Card, Table, Spinner, Modal } from "react-bootstrap";
import { FaUtensils, FaCalendarAlt, FaHistory, FaInfoCircle } from "react-icons/fa";
import VoiceMealLogger from "./VoiceMealLogger";

const FoodTracking = () => {
  const [mealType, setMealType] = useState("");
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [foodItems, setFoodItems] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortBy, setSortBy] = useState("date"); 
  const [filterMeal, setFilterMeal] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchFoodLogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/food/logs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Food logs received:", response.data);
      setFoodLogs(response.data.foodLogs);
    } catch (error) {
      console.error("Error fetching food logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodLogs();
  }, []);

  // Add a single food item to the temporary list
  const addFoodItemToList = () => {
    if (!foodName || quantity <= 0) {
      setErrorMessage("Please enter a valid food name and quantity.");
      return;
    }
    setErrorMessage("");
    const newItem = { name: foodName, quantity };
    setFoodItems([...foodItems, newItem]);
    setFoodName("");
    setQuantity(1);
  };

  // Submit the food log (sends mealType and foodItems to backend)
  const addFoodLog = async () => {
    if (!mealType || foodItems.length === 0) {
      setErrorMessage("Select a meal type and add at least one food item.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/food/log",
        { mealType, foodItems, inputMethod: "text" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setFoodLogs([...foodLogs, response.data.foodLog]);

      setSuccessMessage("Food log added successfully!");

      setMealType("");
      setFoodItems([]);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding food log:", error);
    }
  };

  const deleteFoodLog = async (logId) => {
    try {
      await axios.delete(`http://localhost:5000/food/log/${logId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFoodLogs(foodLogs.filter((log) => log._id !== logId));
    } catch (error) {
      console.error("Error deleting food log:", error);
    }
  };

  // Placeholder for modify functionality
  const modifyFoodLog = (logId) => {
    alert(`Modify functionality for log ${logId} is not yet implemented.`);
  };

  // Apply filtering by meal type
  let filteredLogs = foodLogs;
  if (filterMeal) {
    filteredLogs = filteredLogs.filter(
      (log) => log.mealType.toLowerCase() === filterMeal.toLowerCase()
    );
  }

  // Group logs by date using the dateLogged field (fallback to current date if missing)
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!log || !log.dateLogged) return acc; // Skip undefined logs
    const date = moment(log.dateLogged).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  // Sorting logic: sort by date descending or by meal type alphabetically within each group.
  let sortedLogs = Object.entries(groupedLogs);
  if (sortBy === "date") {
    sortedLogs.sort(([a], [b]) => new Date(b) - new Date(a));
  } else if (sortBy === "mealType") {
    sortedLogs.forEach(([date, logs]) => {
      logs.sort((a, b) => a.mealType.localeCompare(b.mealType));
    });
  }

  if (loading) {
    return (
      <div className="mx-auto d-flex flex-column align-items-center">
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px", color: "#333" }}>Loading food tracker...</p>
      </div>
    );
  }

  return (
    <Container style={styles.container} className="w-100">
      <h2 className="text-center fw-bold">Food Tracker</h2>

      <div className="d-flex gap-4 my-4 justify-content-center">
      {/* Food Logging Form */}
      <Card style={styles.formCard}>
        <Card.Body>
          <Form>
            <h3 className="fs-4 text-center mb-4 fw-bold">Text-Based Food Logging</h3>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="mealType">
                  <Form.Label style={styles.label}>
                    <FaUtensils className="me-2" /> Meal Type
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select Meal Type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="date">
                  <Form.Label style={styles.label}>
                    <FaCalendarAlt className="me-2" /> Date
                  </Form.Label>
                  <Form.Control type="date" name="date" style={styles.input} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="foodName">
                  <Form.Label style={styles.label}>Food Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Food Name"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    style={styles.input}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="quantity">
                  <Form.Label style={styles.label}>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={styles.input}
                  />
                </Form.Group>
              </Col>
            </Row>
            {successMessage && <Alert variant="success" style={styles.successText} className="text-center">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger" style={styles.errorText}>{errorMessage}</Alert>}
            <div className="d-flex gap-5" style={{ alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
            <Button 
                variant="info" 
                onClick={addFoodItemToList} 
                style={{ backgroundColor: "#17a2b8",color: "white",border: "none", padding: "10px 15px", fontSize: "16px", borderRadius: "5px" }}
            >
                + Add Food Item
            </Button>

            <Button 
                variant="primary" 
                onClick={addFoodLog} 
                style={{ backgroundColor: "#007bff", border: "none", padding: "10px 15px", fontSize: "16px", borderRadius: "5px" }}
            >
                Add Food Log
            </Button>
            </div>
            {foodItems.length > 0 && (
                <ul
                    style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "10px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%",
                    maxWidth: "400px",
                    borderRadius: "8px",
                    padding: "10px",
                    }}
                >
            {foodItems.map((item, index) => (
            <li
                key={index}
                style={{
                backgroundColor: "#ffffff",
                padding: "8px 12px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                transition: "transform 0.2s ease-in-out",
                cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                <span style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>
                {item.name} - {item.quantity}
                </span>
                <Button
                variant="link"
                onClick={() => setFoodItems(foodItems.filter((_, i) => i !== index))}
                style={{
                    color: "#ff4d4d",
                    fontSize: "18px",
                    padding: "2px",
                    margin: "0px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    transition: "color 0.2s ease-in-out",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#ff0000")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#ff4d4d")}
                >
                ✖
                </Button>
            </li>
            ))}
            </ul>
            )}
          </Form>
        </Card.Body>
      </Card>
      <VoiceMealLogger />
      </div>
      {/* Food Log List */}
      <h3 style={styles.subHeading} className="fw-bold">Food Logs</h3>
            {/* Sorting & Filtering Controls */}
            <div style={styles.controls}  className="w-75 mx-auto">
        <Form.Control as="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="date">Sort by Date</option>
          <option value="mealType">Sort by Meal Type</option>
        </Form.Control>
        <Form.Control as="select" value={filterMeal} onChange={(e) => setFilterMeal(e.target.value)} style={styles.select}>
          <option value="">Filter by Meal</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </Form.Control>
            </div>
      {sortedLogs.length === 0 ? (
        <p style={styles.noLogs}>No food logs found.</p>
      ) : (
        sortedLogs.map(([date, logs]) => (
          <div key={date} style={styles.logContainer} className="w-75 mx-auto">
            <h3 style={styles.dateTitle}>{moment(date).format("MMMM D, YYYY")}</h3>
            {logs.map((log) => (
              <Card key={log._id} style={styles.foodLog}>
                <Card.Body>
                  <div style={styles.logHeader}>
                    <h4 style={styles.mealType}>{log.mealType.toUpperCase()}</h4>
                    <div style={styles.actionButtons}>
                      <Button variant="warning" onClick={() => modifyFoodLog(log._id)} style={styles.modifyButton}>
                        Modify
                      </Button>
                      <Button variant="danger" onClick={() => deleteFoodLog(log._id)} style={styles.deleteButton}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  {log.foodItems.map((item, index) => (
                    <div key={item.id||index} style={styles.foodItem}>
                      <img src={item.photo} alt={item.foodName} style={styles.foodImage} />
                      <div style={styles.foodDetailsContainer}>
                        <strong style={styles.foodName}>{item.foodName}</strong>
                        <p style={styles.foodDetails}>
                          {item.servingQty} {item.servingUnit} | {item.brandName || "Generic"}
                        </p>
                        <p style={styles.foodNutrients}>
                          <strong>Calories:</strong> {item.calories} kcal | <strong>Protein:</strong> {item.protein}g |{" "}
                          <strong>Carbs:</strong> {item.carbs}g | <strong>Fats:</strong> {item.fats}g
                        </p>
                      </div>
                    </div>
                  ))}
                  <div style={styles.summaryContainer}>
                    <p style={styles.summary}>
                      Total: {log.totalCalories} kcal, {log.totalProtein}g Protein, {log.totalCarbs}g Carbs, {log.totalFats}g Fats
                    </p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ))
      )}

    </Container>
  );
};

const styles = {
  container: {
    margin: "auto",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    background: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  subHeading: {
    textAlign: "center",
    color: "#333",
    margin: "20px 0 10px",
  },
  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    justifyContent: "center",
  },
  select: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    cursor: "pointer",
    fontSize: "14px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    fontSize: "14px",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
  addItemButton: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  foodItemList: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px",
  },
  foodItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e9ecef",
    padding: "5px 10px",
    borderRadius: "4px",
    marginBottom: "5px",
  },
  removeButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#dc3545",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  submitButton: {
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  noLogs: {
    textAlign: "center",
    color: "#777",
  },
  logContainer: {
    marginBottom: "15px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  dateTitle: {
    textAlign: "center",
    color: "#444",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  foodLog: {
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
  },
  logHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealType: {
    margin: "0",
    color: "#0056b3",
    fontSize: "16px",
    fontWeight: "bold",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
  },
  modifyButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#ffc107",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    width: "80px",
  },
  deleteButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    width: "80px",
  },
  foodItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingBottom: "5px",
    borderBottom: "1px solid #ddd",
    marginBottom: "10px",
  },
  foodImage: {
    width: "50px",
    height: "50px",
    borderRadius: "6px",
    objectFit: "cover",
  },
  foodDetailsContainer: {
    flex: "1",
  },
  foodName: {
    fontSize: "14px",
    color: "#222",
  },
  foodDetails: {
    margin: "3px 0",
    fontSize: "12px",
    color: "#555",
  },
  foodNutrients: {
    fontSize: "12px",
    color: "#777",
  },
  summaryContainer: {
    padding: "10px",
    backgroundColor: "#eef",
    borderRadius: "8px",
  },
  summary: {
    fontSize: "13px",
    color: "#444",
    fontWeight: "bold",
    margin: "8px 0 5px",
  },
};

export default FoodTracking;
