import User from '../models/user-model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save()
        .then(() => res.status(201).json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
}