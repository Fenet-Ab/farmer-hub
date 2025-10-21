import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bootstrapRoutes from "./routes/bootstrapRoutes.js";
import cartRoutes from './routes/cartRoutes.js'

import Path from 'path';

import productRoutes from './routes/productRoutes.js';

dotenv.config();
const app = express();

// connect to database
app
connectDB();

// app setup
app.use(cors({origin:process.env.CORS_ORIGIN?.split(',') || '*',credentials:true}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/',(req,res)=> res.json({ok:true,message:'Farmer Supply API v1'}));


// routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads',express.static(Path.join(process.cwd(),'uploads')))
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);


app.use("/api/bootstrap", bootstrapRoutes);





//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server is running on port:${PORT}`))



