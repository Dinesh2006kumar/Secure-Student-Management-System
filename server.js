const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/student_management")
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Secure Student Management System is running!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});