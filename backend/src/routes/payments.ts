import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { payment_date: 'desc' },
      include: {
        booking: {
          include: {
            guest: true,
            room: true
          }
        }
      }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// POST record a payment
router.post('/', async (req, res) => {
  try {
    const { booking_id, amount, payment_method } = req.body;
    
    if (!booking_id || !amount || !payment_method) {
      return res.status(400).json({ error: 'Missing required fields: booking_id, amount, payment_method' });
    }

    const payment = await prisma.payment.create({
      data: {
        booking_id: parseInt(booking_id),
        amount: parseFloat(amount),
        payment_method,
        payment_date: new Date()
      },
      include: {
        booking: {
          include: {
            guest: true,
            room: true
          }
        }
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Failed to record payment:', error);
    res.status(400).json({ error: 'Failed to record payment' });
  }
});

export default router;
