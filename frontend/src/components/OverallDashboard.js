import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Grid, Paper, Typography, Avatar, Box, Card } from "@mui/material";
import "chart.js/auto";
import { useSelector } from "react-redux";

// Reusable Chart Component
const ChartCard = ({ title, children }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 3,
      boxShadow: 3,
      maxWidth: 350,
      textAlign: "center",
      backgroundColor: "#f9f9f9",
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

function OverallDashboard() {
  const { currentUser } = useSelector((state) => state.userReducer);
  const [pieData, setPieChartData] = useState({});
  const [labe, setLabe] = useState([]);
  const [caldata, setCaldata] = useState({});
  const [sugarlabels, setSugarLabels] = useState([]);
  const [fastingsugar, setFastingSugar] = useState([]);
  const [premealsugar, setPreMealSugar] = useState([]);
  const [postmealsugar, setPostMealSugar] = useState([]);
  const [proteinValues, setProteinValues] = useState([]);
  const [sugarValues, setSugarValues] = useState([]);

  useEffect(() => {
    if (!currentUser || !currentUser.foodLogs || currentUser.foodLogs.length === 0) {
      console.warn("No food log data available.");
      return;
    }

    const foodLogs = currentUser.foodLogs;
    const dates = [...new Set(foodLogs.map((log) => log.dateLogged.split("T")[0]))].sort();
    setLabe(dates);

    // Daily Calories Aggregation
    const dailyCalories = {};
    dates.forEach((date) => {
      dailyCalories[date] = 0;
    });
    foodLogs.forEach((log) => {
      const date = log.dateLogged.split("T")[0];
      dailyCalories[date] += log.totalCalories || 0;
    });
    setCaldata(dailyCalories);

    // Macro Nutrients for the Latest Date (Pie Chart Data)
    const latestDate = dates[dates.length - 1];
    const pieChartData = { totalProtein: 0, totalCarbs: 0, totalFats: 0, totalFiber: 0 };
    foodLogs.forEach((log) => {
      if (log.dateLogged.split("T")[0] === latestDate) {
        pieChartData.totalProtein += log.totalProtein || 0;
        pieChartData.totalCarbs += log.totalCarbs || 0;
        pieChartData.totalFats += log.totalFats || 0;
        pieChartData.totalFiber += log.totalFiber || 0;
      }
    });
    setPieChartData(pieChartData);

    // Protein Aggregation per Date (Protein Bar Chart)
    const proteinsByDate = dates.map((date) =>
      foodLogs.reduce((sum, log) => sum + (log.dateLogged.split("T")[0] === date ? log.totalProtein || 0 : 0), 0)
    );
    setProteinValues(proteinsByDate);

    // Sugar Levels Processing
    if (currentUser.sugarLevels && currentUser.sugarLevels.length > 0) {
      const sugarLevels = currentUser.sugarLevels;
      const sugarDates = [...new Set(sugarLevels.map((entry) => entry.date.split("T")[0]))].sort();
      setSugarLabels(sugarDates);

      const fastingSugarArr = [];
      const preMealSugarArr = [];
      const postMealSugarArr = [];
      sugarDates.forEach((date) => {
        const entry = sugarLevels.find((e) => e.date.split("T")[0] === date);
        fastingSugarArr.push(entry.fastingSugarLevel);
        preMealSugarArr.push(entry.preMealSugarLevel);
        postMealSugarArr.push(entry.postMealSugarLevel);
      });
      setFastingSugar(fastingSugarArr);
      setPreMealSugar(preMealSugarArr);
      setPostMealSugar(postMealSugarArr);
    }

    // Sugar Intake Aggregation
    const sugarsByDate = dates.map((date) =>
      foodLogs.reduce((sum, log) => sum + (log.dateLogged.split("T")[0] === date ? log.totalSugars || 0 : 0), 0)
    );
    setSugarValues(sugarsByDate);
  }, [currentUser]);

  if (!currentUser) return <Typography>Loading...</Typography>;

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: "bottom" } },
    scales: { x: { display: true }, y: { display: true } },
  };

  // Sugar Levels Line Chart
  const sugarData = {
    labels: sugarlabels,
    datasets: [
      { label: "Fasting Sugar Level", data: fastingsugar, borderColor: "#FF6384", backgroundColor: "rgba(255, 99, 132, 0.2)", tension: 0.4 },
      { label: "Pre-Meal Sugar Level", data: premealsugar, borderColor: "#36A2EB", backgroundColor: "rgba(54, 162, 235, 0.2)", tension: 0.4 },
      { label: "Post-Meal Sugar Level", data: postmealsugar, borderColor: "#FFCE56", backgroundColor: "rgba(255, 206, 86, 0.2)", tension: 0.4 },
    ],
  };

  // Calories Bar Chart
  const foodLogData = {
    labels: labe,
    datasets: [
      {
        label: "Total Calories per Day",
        data: labe.map((date) => caldata[date]),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Protein Bar Chart
  const proteinData = {
    labels: labe,
    datasets: [{ label: "Protein (g)", data: proteinValues, backgroundColor: "#36A2EB" }],
  };

  // Sugar Intake Line Chart
  const sugarIntakeData = {
    labels: labe,
    datasets: [
      { label: "Sugar Intake (g)", data: sugarValues, borderColor: "#F44336", backgroundColor: "#F4433633", fill: true, tension: 0.4 },
    ],
  };

  // Macro Nutrients Pie Chart
  const macroData = {
    labels: ["Protein", "Carbs", "Fats", "Fibers"],
    datasets: [
      {
        data: [pieData.totalProtein, pieData.totalCarbs, pieData.totalFats, pieData.totalFiber],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#673AB7"],
      },
    ],
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Poppins', sans-serif" }}>
      {/* User Overview Section */}
      <Card sx={{ width: "80%", mb: 3, p: 3, boxShadow: 3, borderRadius: 3, backgroundColor: "#eef7ff", margin: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 60, height: 60, bgcolor: "#1976d2" }}>
            {currentUser.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {currentUser.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {currentUser.email}
            </Typography>
          </Box>
        </Box>
        <Box mt={2} sx={{ textAlign: "left" }}>
          <Typography variant="body1"><strong>Age:</strong> {currentUser.age} years</Typography>
          <Typography variant="body1"><strong>Height:</strong> {currentUser.height} cm</Typography>
          <Typography variant="body1"><strong>Weight:</strong> {currentUser.weight} kg</Typography>
          <Typography variant="body1"><strong>Diabetes Type:</strong> {currentUser.diabetesType}</Typography>
          <Typography variant="body1"><strong>Activity Level:</strong> {currentUser.activityLevel}</Typography>
          <Typography variant="body1"><strong>Dietary Preference:</strong> {currentUser.dietaryPreference}</Typography>
          <Typography variant="body1"><strong>Meal Type Preference:</strong> {currentUser.mealTypePreference}</Typography>
          <Typography variant="body1"><strong>Food Allergies:</strong> {currentUser.foodAllergies.join(", ")}</Typography>
        </Box>
      </Card>

      {/* Charts Section */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <ChartCard title="Sugar Levels">
            <div style={{ height: 200, width: 300 }}>
              <Line data={sugarData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
        <Grid item>
          <ChartCard title="Macro Distribution">
            <div style={{ height: 200, width: 300 }}>
              <Pie data={macroData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
        <Grid item>
          <ChartCard title="Daily Calories">
            <div style={{ height: 200, width: 300 }}>
              <Bar data={foodLogData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
        <Grid item>
          <ChartCard title="Protein Intake">
            <div style={{ height: 200, width: 300 }}>
              <Bar data={proteinData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
        <Grid item>
          <ChartCard title="Sugar Intake">
            <div style={{ height: 200, width: 300 }}>
              <Line data={sugarIntakeData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
      </Grid>
    </div>
  );
}

export default OverallDashboard;
