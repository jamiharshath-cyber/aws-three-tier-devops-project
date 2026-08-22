const express = require("express");
const db = require("./db");
const app = express();
const PORT = 3000;

app.use(express.json());



app.get("/", (req, res) => {
  res.send("AWS Three-Tier DevOps Application CI/CD deployment successful!");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP"
  });
});

app.get("/api/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err.message);
      return res.status(500).json({
        error: "Internal Server Error"
      });
    }

    res.json(results);
  });
});

app.post("/api/employees", (req, res) => {
  const { name, email, department } = req.body;

  const sql =
    "INSERT INTO employees (name, email, department) VALUES (?, ?, ?)";

  db.query(sql, [name, email, department], (err, result) => {
    if (err) {
      console.error("Error adding employee:", err.message);
      return res.status(500).json({
        error: "Internal Server Error"
      });
    }

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      department
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
