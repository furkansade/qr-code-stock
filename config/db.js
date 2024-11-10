const mongoose = require('mongoose');

const connectToDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME,
    })
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.error('Connection failed', err);
    });
};

module.exports = connectToDatabase;