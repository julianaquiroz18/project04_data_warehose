require('dotenv').config();
const { securityPolicy } = require('./middlewares/securityPolicy');
const path = require('path');
const express = require('express');
const { initDatabase } = require('./database');
const { errorHandler } = require('./middlewares/errorHandler');
const { router } = require('./routes/routes.js');
var cors = require('cors');
const helmet = require("helmet");
const { SERVER_PORT } = require('./config');

async function main() {
    const server = express();
    const fePath = path.join(__dirname, '..', '..', 'Data_warehouse_FE');
    server.use(cors()); //Enable CORS Origin *
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
    server.use(helmet());
    server.use(securityPolicy);
    server.use('/data_wharehose/v1', router);
    server.use(express.static(fePath))
    server.use(errorHandler);

    const mongoose = await initDatabase();
    server.listen(SERVER_PORT, () => {
        console.log(`Server is UP via port ${SERVER_PORT}...`);
    });
}

main();