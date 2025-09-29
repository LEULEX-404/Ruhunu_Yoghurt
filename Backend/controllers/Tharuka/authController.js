import User from '../../models/Tharuka/User.js';
import Employee from '../../models/Tharuka/Employee.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    const { name, email, address, phone, password } = req.body;
    try{
        let user = await User.findOne({ email});
        if(user) 
            return res.status(400).json({ message: 'User already exists'});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            address,
            phone,
            password: hashedPassword
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        let user = await User.findOne({ email });

        if (!user) {
            user = await Employee.findOne({ email });
        }
        if(!user)
            return res.status(400).json({ message: 'Cannot find user with this email'});

        let isMatch = false;
        
        if(user.role)
        {
         isMatch = await bcrypt.compare(password, user.password);
        }
        else{
            isMatch = password === user.password
        }
        if(!isMatch)
            return res.status(400).json({ message: 'Invalid credentials'});

        const userRole = user.role || user.position;

        const token = jwt.sign({ id: user._id, role: userRole }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: userRole, employeeID: user.employeeID || null } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};