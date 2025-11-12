const express = require('express');
const accountRoute = require('./src/route/accountRoute');
const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
app.use(express.json());
// app.use(logger);

app.use('/api/accounts', accountRoute);

app.use((req, res, next) => {
    res.status(404).json({error: "Not Fount"})
})
app.use(errorHandler);

module.exports = app;