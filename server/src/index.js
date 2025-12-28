// index.js (or server.js)

// 1️ Load env variables first - must be imported before any other modules
import './config/env.js';

// 2️ Imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import Path from 'path';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bootstrapRoutes from "./routes/bootstrapRoutes.js";
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js";

// 3️ Optional: Debug Cloudinary env vars
console.log("Cloudinary ENV:", {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING",
});

//  Initialize Express
const app = express();

//  Connect to MongoDB
connectDB();

// 6️Middleware
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : '*';

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

// Serve static uploads folder (for local uploads fallback)
app.use('/uploads', express.static(Path.join(process.cwd(), 'uploads')));

// 7️Routes
app.get('/', (req, res) => res.json({ ok: true, message: 'Farmer Supply API v1' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bootstrap', bootstrapRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use("/api/payments", paymentRoutes);

// 8️ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
