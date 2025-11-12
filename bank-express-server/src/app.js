const express = require('express');
const accountsRouter = require('./routes/accounts');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Built-in middleware
app.use(express.json());

// Custom logger middleware
app.use(logger);

// Routes
app.use('/api/accounts', accountsRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' })
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;