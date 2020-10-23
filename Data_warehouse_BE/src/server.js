require('dotenv').config();
const express = require('express');
const { initDatabase } = require('./database');
const { errorHandler } = require('./middlewares/errorHandler');
const { router } = require('./routes/routes.js');
var cors = require('cors');
const helmet = require("helmet");
const { SERVER_PORT } = require('./config');

async function main() {
    const server = express();
    server.use(express.json());
    server.use(cors()); //Enable CORS Origin *
    server.use(express.urlencoded({ extended: false }));
    server.use(helmet());
    server.use('/data_wharehose/v1', router);
    server.use(errorHandler);

    const mongoose = await initDatabase();
    server.listen(SERVER_PORT, () => {
        console.log(`Server is UP via port ${SERVER_PORT}...`);
    });
}

main();