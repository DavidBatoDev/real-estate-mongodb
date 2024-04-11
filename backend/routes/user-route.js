import express from 'express';
import { testUser, updateUser, deleteUser, getUserListings } from '../controllers/user-controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', testUser);

router.put('/update/:id', verifyToken, updateUser)

router.delete('/delete/:id', verifyToken, deleteUser)

router.get('/listings/:userId', verifyToken, getUserListings)

export default router;