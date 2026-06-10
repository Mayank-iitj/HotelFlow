import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Prisma Client with driver adapter
const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
export const prisma = new PrismaClient({ adapter });

import roomRoutes from './routes/rooms';
import guestRoutes from './routes/guests';
import bookingRoutes from './routes/bookings';
import dashboardRoutes from './routes/dashboard';
import housekeepingRoutes from './routes/housekeeping';
import paymentRoutes from './routes/payments';
import userRoutes from './routes/users';

app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'HotelFlow API is running' });
});

// Basic Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
