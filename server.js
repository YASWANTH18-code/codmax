require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));

const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
        return res.status(409).json({ message: "That value is already in use." });
    }
    res.status(500).json({
        message: process.env.NODE_ENV === "production"
            ? "Something went wrong."
            : (err.message || "Server error.")
    });
});

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`BlogSpace is running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Could not start the application:", error.message);
        process.exit(1);
    });
