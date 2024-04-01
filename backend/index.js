import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGODB_URI

mongoose.connect(URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error:', error);
})

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});