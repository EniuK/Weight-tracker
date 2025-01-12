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

