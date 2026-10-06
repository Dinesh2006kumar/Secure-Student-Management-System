const express = require("express");
const Student = require("../models/Student");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// ADD A NEW STUDENT
// POST /api/students
// ==========================================
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            email,
            department,
            year,
            phone
        } = req.body;

        // Check required fields
        if (
            !name ||
            !rollNumber ||
            !email ||
            !department ||
            !year ||
            !phone
        ) {
            return res.status(400).json({
                message: "Please provide all student details"
            });
        }

        // Check duplicate roll number
        const existingRollNumber = await Student.findOne({
            rollNumber
        });

        if (existingRollNumber) {
            return res.status(400).json({
                message: "Student with this roll number already exists"
            });
        }

        // Check duplicate email
        const existingEmail = await Student.findOne({
            email
        });

        if (existingEmail) {
            return res.status(400).json({
                message: "Student with this email already exists"
            });
        }

        // Create student
        const student = await Student.create({
            name,
            rollNumber,
            email,
            department,
            year,
            phone
        });

        res.status(201).json({
            message: "Student added successfully",
            student
        });

    } catch (error) {
        console.error("Add student error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// GET ALL STUDENTS
// GET /api/students
// ==========================================
router.get("/", authenticateToken, async (req, res) => {
    try {
        const students = await Student.find();

        res.status(200).json({
            message: "Students retrieved successfully",
            students
        });

    } catch (error) {
        console.error("Get students error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// GET ONE STUDENT
// GET /api/students/:id
// ==========================================
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student retrieved successfully",
            student
        });

    } catch (error) {
        console.error("Get student error:", error);

        res.status(400).json({
            message: "Invalid student ID"
        });
    }
});


// ==========================================
// UPDATE STUDENT
// PUT /api/students/:id
// ==========================================
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {
        console.error("Update student error:", error);

        res.status(400).json({
            message: "Error updating student"
        });
    }
});


// ==========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ==========================================
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Delete student error:", error);

        res.status(400).json({
            message: "Error deleting student"
        });
    }
});


// Export router
module.exports = router;