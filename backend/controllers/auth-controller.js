import User from '../models/user-model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json('User added!');
    }
    catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) return next(errorHandler(404, 'User not found!'));
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return next(errorHandler(401, 'Invalid password!'));
        // used jwt to create a token and set it as a cookie
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        // passed the rest spread operator to remove the password from the user object
        const { password: pass , ...rest} = user._doc
        // set the token as a cookie and send the user object as a response
        res.cookie('access_token', token, {
            httpOnly: true,
        }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}