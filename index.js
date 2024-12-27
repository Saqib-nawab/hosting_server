const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Replace with your client’s URL
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("PostgreSQL connection error:", err));

// Endpoint to fetch data
app.get('/api/data', async (req, res) => {
    try {
        const client = await pool.connect();
        console.log('Connected to database successfully'); // Confirm database connection
        const result = await client.query('SELECT * FROM users LIMIT 1');
        client.release(); // Release the connection
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database Connection or Query Error:', err); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});