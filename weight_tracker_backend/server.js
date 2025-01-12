const express = require("express");
const cors = require("cors");
const postgresPool = require("pg").Pool;
const app = express();
const bodyParser = require("body-parser");
port = process.env.port || 3005;

