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
import promoCodeRouter from './routes/Lasiru/promocoderoutes.js';
import cartRoutes from './routes/Lasiru/cartRoutes.js'
import paymentRouter from './routes/Lasiru/paymentRoutes.js';
import orderRoutes from './routes/Lasiru/orderRoutes.js';
import cartRouter from './routes/Pathum/cartRoute.js';
import notificationsRoutes from "./routes/Lasiru/emailRoute.js";
import damageProductRouter from './routes/Pathum/damageRoute.js';
import HrReportRoutes from './routes/Tharuka/reportRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: '*', credentials: true, allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

app.use('/api',authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/hrreports',HrReportRoutes)
app.use('/api/deliveries',deliveryRoutes);
app.use('/api/attendance', attendenceRoutes);
app.use('/api/user',userRoutes);
app.use('/api/driver',driverRoutes);
app.use('/api/promocode', promoCodeRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRouter);
app.use("/api/orders", orderRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api/products', productRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/cart', cartRouter)
app.use("/api/ordernotifications", notificationsRoutes);
app.use('/api/damage', damageProductRouter)

const PORT = process.env.PORT || 8070;

// Health check
app.get('/healthz', (req, res) => res.send('OK'));

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

}); 
