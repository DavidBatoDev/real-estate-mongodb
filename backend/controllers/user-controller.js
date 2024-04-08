import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user-model.js';

export const testUser = (req, res, next) => {
    res.send('User route works!');
}

export const updateUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar    
            }
        }, {new: true})

        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User deleted!')
    } catch (error) {
        next(error)
    }
}
