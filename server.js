const express = require("express");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("AWS Three-Tier DevOps Application is running!");
});

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP"
  });
});

// Get all employees
app.get("/api/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err.message);
      return res.status(500).json({
        error: "Internal Server Error"
      });
    }

    res.status(200).json(results);
  });
});

// Get employee by ID
app.get("/api/employees/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM employees WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching employee:", err.message);
        return res.status(500).json({
          error: "Internal Server Error"
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          error: "Employee not found"
        });
      }

      res.status(200).json(results[0]);
    }
  );
});

// Create employee
app.post("/api/employees", (req, res) => {
  const { name, email, department } = req.body;

  if (!name || !email || !department) {
    return res.status(400).json({
      error: "name, email and department are required"
    });
  }

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

// Update employee
app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, department } = req.body;

  if (!name || !email || !department) {
    return res.status(400).json({
      error: "name, email and department are required"
    });
  }

  const sql =
    "UPDATE employees SET name = ?, email = ?, department = ? WHERE id = ?";

  db.query(sql, [name, email, department, id], (err, result) => {
    if (err) {
      console.error("Error updating employee:", err.message);
      return res.status(500).json({
        error: "Internal Server Error"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Employee not found"
      });
    }

    res.status(200).json({
      id,
      name,
      email,
      department
    });
  });
});

// Delete employee
app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM employees WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting employee:", err.message);
        return res.status(500).json({
          error: "Internal Server Error"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Employee not found"
        });
      }

      res.status(200).json({
        message: "Employee deleted successfully"
      });
    }
  );
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
