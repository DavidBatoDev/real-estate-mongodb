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

// error validation middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).send({
        success: false,
        message: message,
        statusCode: statusCode,
    });
});
