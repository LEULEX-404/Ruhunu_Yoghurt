import jwt from 'jsonwebtoken';
import Employee from '../models/Tharuka/Employee.js'

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await Employee.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = {
            id: user._id,
            employeeID: user.employeeID,
            role: user.role
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};