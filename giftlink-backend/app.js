/*jshint esversion: 8 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');

const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const port = 3060;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
    })
    .catch((e) => {
        console.error('Failed to connect to DB', e);
    });

// HTTP request logger
const pinoHttp = require('pino-http');
app.use(pinoHttp({ logger: pinoLogger }));

// Gift API routes
app.use('/api/gifts', giftRoutes);

// Search API routes
app.use('/api/gifts/search', searchRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Home route
app.get('/', (req, res) => {
    res.send('Inside the server');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
