import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET all staff (excluding passwords)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { name: 'asc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff directory' });
  }
});

// POST create staff user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing name, email, or password' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // For local prototyping, plaintext or simple hash is fine
        role: role || 'RECEPTIONIST'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Failed to create user:', error);
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
});

// DELETE delete staff user
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.user.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete staff user' });
  }
});

export default router;
