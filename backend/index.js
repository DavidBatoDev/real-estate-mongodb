// imports
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user-route.js';

// constants
const URI = process.env.MONGODB_URI
const app = express();


// middleware
dotenv.config();

mongoose.connect(URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error:', error);
})

// listen
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// routes
app.use('/api/users', userRouter);
