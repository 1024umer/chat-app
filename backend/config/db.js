const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongodb connected${conn.connection.host}`.green.bold.underline)
    } catch (error) {
        console.log(error)
        process.exit();
    }
}
module.exports = connectDB;