import express from 'express';
import userRoutes from '../src/routes/user.routes.js'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use('/api/v1/auth',userRoutes);
export default app;