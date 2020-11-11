require('dotenv').config();
const User = require('./src/models/users');
const { initDatabase } = require('./src/database');
const { encryptPassword } = require('./src/middlewares/users')
const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'admin> '
});

function query(queryString) {
    return new Promise((resolve, reject) => {
        rl.question(queryString, (answer) => {
            resolve(answer);
        });
    });
}

async function createInitialData() {
    initDatabase(false);
    const adminUser = {
        name: 'admin1',
        lastname: 'admin1',
        email: await query('What is the admin email?: '),
        isAdmin: true,
        password: encryptPassword(await query('What is the admin password?: '))
    };
    const user = new User(adminUser);
    await user.save();
    process.exit(0);
}

createInitialData()