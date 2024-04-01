// imports
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user-route.js';
import authRouter from './routes/auth-route.js';

// constants
const app = express();

// middleware
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error:', error);
})

app.use(express.json());

// listen
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
