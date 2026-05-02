const express = require('express');
const { z } = require('zod');

const createTaskRouter = (db) => {
  const router = express.Router();

  // Validation schemas
  const createTaskSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    projectId: z.string(),
    status: z.enum(['todo', 'in-progress', 'review', 'done']).default('todo'),
    priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
    assigneeId: z.string().optional(),
    dueDate: z.string().optional(),
    tags: z.array(z.string()).optional(),
    dependencies: z.array(z.string()).optional(),
    estimatedHours: z.number().optional(),
    actualHours: z.number().optional()
  });

  const updateTaskSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
    priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
    assigneeId: z.string().optional(),
    dueDate: z.string().optional(),
    tags: z.array(z.string()).optional(),
    dependencies: z.array(z.string()).optional(),
    estimatedHours: z.number().optional(),
    actualHours: z.number().optional()
  });

  // Create task
  router.post('/', async (req, res) => {
    try {
      const data = createTaskSchema.parse(req.body);
      
      const taskRef = await db.collection('tasks').add({
        ...data,
        ownerId: req.user.uid,
        createdAt: db.FieldValue.serverTimestamp(),
        updatedAt: db.FieldValue.serverTimestamp()
      });

      res.status(201).json({ id: taskRef.id, ...data });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // Get task
  router.get('/:id', async (req, res) => {
    try {
      const taskDoc = await db.collection('tasks').doc(req.params.id).get();
      
      if (!taskDoc.exists) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ id: taskDoc.id, ...taskDoc.data() });
    } catch (error) {
      console.error('Error getting task:', error);
      res.status(500).json({ error: 'Failed to get task' });
    }
  });

  // Update task
  router.put('/:id', async (req, res) => {
    try {
      const data = updateTaskSchema.parse(req.body);
      
      await db.collection('tasks').doc(req.params.id).update({
        ...data,
        updatedAt: db.FieldValue.serverTimestamp()
      });

      res.json({ id: req.params.id, ...data });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // Delete task
  router.delete('/:id', async (req, res) => {
    try {
      await db.collection('tasks').doc(req.params.id).delete();
      res.json({ message: 'Task deleted' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // List tasks by project
  router.get('/project/:projectId', async (req, res) => {
    try {
      const snapshot = await db
        .collection('tasks')
        .where('projectId', '==', req.params.projectId)
        .orderBy('createdAt', 'desc')
        .get();

      const tasks = [];
      snapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() });
      });

      res.json(tasks);
    } catch (error) {
      console.error('Error listing tasks:', error);
      res.status(500).json({ error: 'Failed to list tasks' });
    }
  });

  // Assign task
  router.post('/:id/assign', async (req, res) => {
    try {
      const { assigneeId } = req.body;
      
      if (!assigneeId) {
        return res.status(400).json({ error: 'assigneeId is required' });
      }

      await db.collection('tasks').doc(req.params.id).update({
        assigneeId,
        updatedAt: db.FieldValue.serverTimestamp()
      });

      res.json({ message: 'Task assigned' });
    } catch (error) {
      console.error('Error assigning task:', error);
      res.status(500).json({ error: 'Failed to assign task' });
    }
  });

  return router;
};

module.exports = createTaskRouter;
