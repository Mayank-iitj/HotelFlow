import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET all housekeeping tasks (returns housekeeping records for all rooms)
router.get('/', async (req, res) => {
  try {
    // Make sure all rooms have a housekeeping entry. If not, create one.
    const rooms = await prisma.room.findMany();
    const housekeeping = await prisma.housekeeping.findMany({
      include: { room: true }
    });

    const roomIdsWithHk = new Set(housekeeping.map(h => h.room_id));
    const missingRooms = rooms.filter(r => !roomIdsWithHk.has(r.id));

    if (missingRooms.length > 0) {
      await Promise.all(
        missingRooms.map(room => 
          prisma.housekeeping.create({
            data: {
              room_id: room.id,
              status: room.status === 'AVAILABLE' ? 'CLEAN' : room.status === 'CLEANING' ? 'CLEANING' : 'DIRTY'
            }
          })
        )
      );
      // Fetch again to include the newly created ones
      const updatedHousekeeping = await prisma.housekeeping.findMany({
        orderBy: { room: { room_number: 'asc' } },
        include: { room: true }
      });
      return res.json(updatedHousekeeping);
    }

    res.json(housekeeping);
  } catch (error) {
    console.error('Failed to fetch housekeeping tasks:', error);
    res.status(500).json({ error: 'Failed to fetch housekeeping records' });
  }
});

// POST assign housekeeping staff or create a task
router.post('/', async (req, res) => {
  try {
    const { room_id, assigned_staff, status } = req.body;
    
    if (!room_id) {
      return res.status(400).json({ error: 'Missing room_id' });
    }

    const task = await prisma.housekeeping.create({
      data: {
        room_id: parseInt(room_id),
        assigned_staff: assigned_staff ? parseInt(assigned_staff) : null,
        status: status || 'DIRTY'
      },
      include: { room: true }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create housekeeping task' });
  }
});

// PUT update housekeeping task (and synchronize with Room status)
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, assigned_staff } = req.body;

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (assigned_staff !== undefined) data.assigned_staff = assigned_staff ? parseInt(assigned_staff) : null;

    const task = await prisma.housekeeping.update({
      where: { id },
      data,
      include: { room: true }
    });

    // Sync room status based on cleaning updates
    if (status) {
      let roomStatus = 'AVAILABLE';
      if (status === 'DIRTY') {
        roomStatus = 'DIRTY';
      } else if (status === 'CLEANING') {
        roomStatus = 'CLEANING';
      } else if (status === 'CLEAN') {
        // If the room is already OCCUPIED, keep it OCCUPIED. Otherwise make it AVAILABLE.
        if (task.room.status === 'OCCUPIED') {
          roomStatus = 'OCCUPIED';
        } else {
          roomStatus = 'AVAILABLE';
        }
      }

      await prisma.room.update({
        where: { id: task.room_id },
        data: { status: roomStatus }
      });
    }

    res.json(task);
  } catch (error) {
    console.error('Failed to update housekeeping task:', error);
    res.status(400).json({ error: 'Failed to update housekeeping task' });
  }
});

export default router;
