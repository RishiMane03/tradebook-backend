import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/db.js';
import testRoutes from './routes/test.routes.js';
import strategyRoutes from './routes/strategy.routes.js'
import tradeRoutes from './routes/trade.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use('/api/testing/', testRoutes);
app.use("/api/strategies", strategyRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/analytics", analyticsRoutes);

// connect to database
connectDB();

app.get('/home', (req, res) => {
  res.json({ message: 'Welcome to the home page!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✅`);
});