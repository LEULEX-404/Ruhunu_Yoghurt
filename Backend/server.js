import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/Tharuka/authRoutes.js';
import employeeRoutes from './routes/Tharuka/employeeRoutes.js';
import deliveryRoutes from './routes/Imasha/deliveryRoutes.js';
import attendenceRoutes from './routes/Tharuka/attendence.js';
import userRoutes from './routes/Tharuka/userRoutes.js';
import driverRoutes from './routes/Imasha/driverRoutes.js';
import cors from 'cors';
import productRouter from './routes/Pathum/productRoute.js';
import paymentRouter from './routes/Pathum/payment.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true, allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

app.use('/api',authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/deliveries',deliveryRoutes);
app.use('/api/attendance', attendenceRoutes);
app.use('/api/user',userRoutes);
app.use('/api/driver',driverRoutes);
app.use('/api/products', productRouter)
app.use('/api/payments', paymentRouter)


const PORT = process.env.PORT || 8070;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

}); 