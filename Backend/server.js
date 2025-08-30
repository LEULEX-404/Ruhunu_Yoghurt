import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import deliveryRoutes from './routes/Imasha/deliveryRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Adjust the origin as needed
app.use(express.json());

app.use('/api/deliveries', deliveryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 8070;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

}); 