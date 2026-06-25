const express =require ('express');
const dotenv=require('dotenv');
const cors=require ('cors');
const mongoose =require('mongoose');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const dns = require("dns");
// Override DNS to bypass ISP/network blocks on MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const app=express()
app.use(cors());


const connectDb = async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        tls: true,
        serverSelectionTimeoutMS: 15000,
    })
    .then(() => console.log("Database connected successfully"))
    .catch((err) => {
        console.error("Database connection error:", err.message);
        process.exit(1);
    });
};
connectDb();


const PORT= process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);

});