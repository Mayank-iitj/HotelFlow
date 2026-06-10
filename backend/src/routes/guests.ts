import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET all guests
router.get('/', async (req, res) => {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
});

// GET single guest
router.get('/:id', async (req, res) => {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { bookings: { include: { room: true } } }
    });
    if (guest) res.json(guest);
    else res.status(404).json({ error: 'Guest not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guest' });
  }
});

// POST create guest
router.post('/', async (req, res) => {
  try {
    const guest = await prisma.guest.create({
      data: req.body
    });
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create guest' });
  }
});

// PUT update guest
router.put('/:id', async (req, res) => {
  try {
    const guest = await prisma.guest.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(guest);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update guest' });
  }
});

// DELETE guest
router.delete('/:id', async (req, res) => {
  try {
    await prisma.guest.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete guest' });
  }
});

export default router;
