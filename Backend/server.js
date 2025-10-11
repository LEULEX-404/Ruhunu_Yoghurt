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
import StockRouter from './routes/Kalindu/StockRoutes.js';
import RawMaterialRoutes from "./routes/Kalindu/RawmaterialRoutes.js";
import supplierRoutes from './routes/Kalindu/SuplierRoutes.js';
import DeliveryReportsRoutes from './routes/Imasha/reportRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true, allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

app.use('/api',authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/hrreports',HrReportRoutes)
app.use('/api/deliveries',deliveryRoutes);
app.use('/api/attendance', attendenceRoutes);
app.use('/api/user',userRoutes);
app.use('/api/driver',driverRoutes);
app.use('/api/products', productRouter);
app.use('/api/promocode', promoCodeRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRouter);
app.use('/api/payment', paymentRouter);
app.use("/api/orders", orderRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api/products', productRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/cart', cartRouter)
app.use('/api/stock', StockRouter);
app.use("/api/rawmaterials", RawMaterialRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/deliveryreports',DeliveryReportsRoutes);

const PORT = process.env.PORT || 8070;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

}); 