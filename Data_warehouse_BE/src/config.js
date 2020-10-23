const DB_HOST = process.env.DB_HOST;
const SERVER_PORT = process.env.PORT;
const DB_DATABASE = process.env.DB_DATABASE;

module.exports = {
    HOST: DB_HOST,
    SERVER_PORT: SERVER_PORT,
    DATABASE: DB_DATABASE
}