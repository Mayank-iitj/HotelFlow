import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        guest: true,
        room: true
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { guest: true, room: true, payments: true }
    });
    if (booking) res.json(booking);
    else res.status(404).json({ error: 'Booking not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST create booking
router.post('/', async (req, res) => {
  try {
    const { guest_id, room_id, check_in, check_out, status } = req.body;
    const booking = await prisma.booking.create({
      data: {
        guest_id: parseInt(guest_id),
        room_id: parseInt(room_id),
        check_in: new Date(check_in),
        check_out: new Date(check_out),
        status: status || 'PENDING'
      },
      include: { guest: true, room: true }
    });
    
    // Also update room status
    if (status === 'CONFIRMED') {
      await prisma.room.update({
        where: { id: parseInt(room_id) },
        data: { status: 'RESERVED' }
      });
    }
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create booking' });
  }
});

// PUT update booking
router.put('/:id', async (req, res) => {
  try {
    const data: any = { ...req.body };
    if (data.check_in) data.check_in = new Date(data.check_in);
    if (data.check_out) data.check_out = new Date(data.check_out);
    if (data.guest_id) data.guest_id = parseInt(data.guest_id);
    if (data.room_id) data.room_id = parseInt(data.room_id);

    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { guest: true, room: true }
    });

    // Handle status sync
    if (data.status === 'ACTIVE') {
      await prisma.room.update({
        where: { id: booking.room_id },
        data: { status: 'OCCUPIED' }
      });
    } else if (data.status === 'COMPLETED') {
      await prisma.room.update({
        where: { id: booking.room_id },
        data: { status: 'DIRTY' }
      });
      // Also mark housekeeping as DIRTY
      await prisma.housekeeping.updateMany({
        where: { room_id: booking.room_id },
        data: { status: 'DIRTY' }
      });
    }

    res.json(booking);
  } catch (error) {
    console.error('Failed to update booking:', error);
    res.status(400).json({ error: 'Failed to update booking' });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete booking' });
  }
});

export default router;
