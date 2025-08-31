import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import employeeRoutes from './routes/Tharuka/employeeRoutes.js';
import deliveryRoutes from './routes/Imasha/deliveryRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Adjust the origin as needed
app.use(express.json());


app.use('/api/employees', employeeRoutes);
app.use('/api/deliveries',deliveryRoutes);

const PORT = process.env.PORT || 8070;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

}); 