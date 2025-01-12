# Weight-tracker

In the backend/server.js file, you'll need to set up your PostgreSQL database credentials. Open the server.js file and update the following details: 
PostgreSQL password: Replace <your-postgres-password> with your actual PostgreSQL password.
PostgreSQL username: Replace <your-postgres-username> with your PostgreSQL username.
Port: Set the port you want your server to listen on (default is 3005).

const { Pool } = require('pg');
const pool = new Pool({
  user: '<your-postgres-username>',
  host: 'localhost',
  database: '<your-database-name>',
  password: '<your-postgres-password>',
  port: 5432, // Default PostgreSQL port
});

const express = require('express');
const app = express();
const port = 3005; // You can change this to your desired port

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

After you've installed all dependencies and configured the backend, you can start the frontend and backend servers.
In the backend folder, run:

npm start

This will start the backend server and connect to the PostgreSQL database.


In the frontend folder, run:

npm start

This will start the frontend application, usually on a different port (e.g., http://localhost:3000).

