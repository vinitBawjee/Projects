const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');

require("dotenv").config();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
connectDB();

server.listen(PORT, () => {
    console.log(`Bank API server running on http://localhost:${PORT}`);
});
