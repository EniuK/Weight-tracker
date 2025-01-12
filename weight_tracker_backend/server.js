const express = require("express");
const cors = require("cors");
const postgresPool = require("pg").Pool;
const app = express();
const bodyParser = require("body-parser");
port = process.env.port || 3005;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server running on port ${port}`);
});

const pool = new postgresPool({
  user: "",
  password: "",
  database: "weight_tracker_master",
  host: "localhost",
  port: 5432,
  max: 10,
});

pool.connect((err, connection) => {
  if (err) throw err;
  console.log(`connected to database successfully`);
});

app.get("/weight_main_table", (req, res) => {
  const sql = "SELECT * FROM weight_main_table";
  pool.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.status(200).json(result.rows);
  });
});

app.post("/weight_main_table", async (req, res) => {
  const { weight, date } = req.body;

  if (!weight) {
    return res.status(400).json({ error: "Weight is required" });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  const currentDate = new Date();
  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({ error: "Invalid date value" });
  }

  if (selectedDate > currentDate) {
    return res.status(400).json({ error: "Date cannot be in the future" });
  }

  try {
    const checkDateSQL = "SELECT * FROM weight_main_table WHERE date = $1";
    const dateResult = await pool.query(checkDateSQL, [date]);

    if (dateResult.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Date already exists in the database" });
    }

    const insertSQL =
      "INSERT INTO weight_main_table(weight, date) VALUES($1, $2) RETURNING *";
    const insertResult = await pool.query(insertSQL, [weight, date]);

    console.log("Insertion successful");
    return res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    return res
      .status(500)
      .json({ error: "Database error", details: err.message });
  }
});

app.put("/weight_main_table/:date", async (req, res) => {
  const { weight, date } = req.body;
  const originalDate = req.params.date;

  if (!originalDate) {
    return res.status(400).json({ error: "Date is required in URL parameter" });
  }

  if (!weight) {
    return res
      .status(400)
      .json({ error: "Weight is required in request body" });
  }

  try {
    const checkDateSql = `
      SELECT * FROM weight_main_table 
      WHERE date = $1
    `;
    const checkDateResult = await pool.query(checkDateSql, [date]);

    if (checkDateResult.rowCount > 0 && date !== originalDate) {
      return res
        .status(409)
        .json({ error: "Date already exists in the database" });
    }

    const updateSql = `
      UPDATE weight_main_table 
      SET weight = $1, date = $2
      WHERE date = $3
      RETURNING *
    `;
    const updateResult = await pool.query(updateSql, [
      weight,
      date,
      originalDate,
    ]);

    if (updateResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No entry found for the original date" });
    }

    return res.status(200).json({
      message: "Weight updated successfully",
      updatedRecord: updateResult.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    return res
      .status(500)
      .json({ error: "Database error", details: err.message });
  }
});

app.delete("/weight_main_table/:date", (req, res) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ error: "Date is required in URL parameter" });
  }

  const sql = `
    DELETE FROM weight_main_table 
    WHERE date = $1
    RETURNING *`;

  pool.query(sql, [date], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No entry found for the given date" });
    }

    return res.status(200).json({
      message: "Weight from this date has been deleted",
      deletedRecord: result.rows[0],
    });
  });
});
