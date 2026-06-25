const express =require ('express');
const dotenc=require('dotenv');
const core=require ('cors');
const mongoose =require('mongoose');
dotenv.config();

const app=express()
app.use(cors());

const PORT= process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);

});