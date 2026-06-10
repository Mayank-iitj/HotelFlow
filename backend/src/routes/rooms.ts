import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { room_number: 'asc' }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// GET single room
router.get('/:id', async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { bookings: true }
    });
    if (room) res.json(room);
    else res.status(404).json({ error: 'Room not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// POST create room
router.post('/', async (req, res) => {
  try {
    const room = await prisma.room.create({
      data: req.body
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create room' });
  }
});

// PUT update room
router.put('/:id', async (req, res) => {
  try {
    const room = await prisma.room.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update room' });
  }
});

// DELETE room
router.delete('/:id', async (req, res) => {
  try {
    await prisma.room.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete room' });
  }
});

export default router;
