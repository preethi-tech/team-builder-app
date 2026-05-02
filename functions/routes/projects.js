const express = require('express');
const { z } = require('zod');

const createProjectRouter = (db) => {
  const router = express.Router();

  // Validation schemas
  const createProjectSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    color: z.string().optional()
  });

  const updateProjectSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    color: z.string().optional()
  });

  // Create project
  router.post('/', async (req, res) => {
    try {
      const data = createProjectSchema.parse(req.body);
      
      const projectRef = await db.collection('projects').add({
        ...data,
        ownerId: req.user.uid,
        createdAt: db.FieldValue.serverTimestamp(),
        updatedAt: db.FieldValue.serverTimestamp()
      });

      // Add owner as member
      await db.collection('projects').doc(projectRef.id)
        .collection('members').doc(req.user.uid).set({
          userId: req.user.uid,
          role: 'owner',
          joinedAt: db.FieldValue.serverTimestamp()
        });

      // Update user's project list
      await db.collection('users').doc(req.user.uid).update({
        projectIds: db.FieldValue.arrayUnion(projectRef.id)
      });

      res.status(201).json({ id: projectRef.id, ...data });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  // Get project
  router.get('/:id', async (req, res) => {
    try {
      const projectDoc = await db.collection('projects').doc(req.params.id).get();
      
      if (!projectDoc.exists) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ id: projectDoc.id, ...projectDoc.data() });
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({ error: 'Failed to get project' });
    }
  });

  // Update project
  router.put('/:id', async (req, res) => {
    try {
      const data = updateProjectSchema.parse(req.body);
      
      await db.collection('projects').doc(req.params.id).update({
        ...data,
        updatedAt: db.FieldValue.serverTimestamp()
      });

      res.json({ id: req.params.id, ...data });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  // Delete project
  router.delete('/:id', async (req, res) => {
    try {
      await db.collection('projects').doc(req.params.id).delete();
      res.json({ message: 'Project deleted' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // List user projects
  router.get('/', async (req, res) => {
    try {
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      
      if (!userDoc.exists || !userDoc.data().projectIds) {
        return res.json([]);
      }

      const projectIds = userDoc.data().projectIds;
      
      if (projectIds.length === 0) {
        return res.json([]);
      }

      const snapshot = await db
        .collection('projects')
        .where(db.FieldPath.documentId(), 'in', projectIds)
        .get();

      const projects = [];
      snapshot.forEach(doc => {
        projects.push({ id: doc.id, ...doc.data() });
      });

      res.json(projects);
    } catch (error) {
      console.error('Error listing projects:', error);
      res.status(500).json({ error: 'Failed to list projects' });
    }
  });

  // Add member to project
  router.post('/:id/members', async (req, res) => {
    try {
      const { userId, role } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      await db.collection('projects').doc(req.params.id)
        .collection('members').doc(userId).set({
          userId,
          role: role || 'member',
          joinedAt: db.FieldValue.serverTimestamp()
        });

      // Update user's project list
      await db.collection('users').doc(userId).update({
        projectIds: db.FieldValue.arrayUnion(req.params.id)
      });

      res.json({ message: 'Member added' });
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({ error: 'Failed to add member' });
    }
  });

  // Remove member from project
  router.delete('/:id/members/:userId', async (req, res) => {
    try {
      await db.collection('projects').doc(req.params.id)
        .collection('members').doc(req.params.userId).delete();

      // Update user's project list
      await db.collection('users').doc(req.params.userId).update({
        projectIds: db.FieldValue.arrayRemove(req.params.id)
      });

      res.json({ message: 'Member removed' });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({ error: 'Failed to remove member' });
    }
  });

  return router;
};

module.exports = createProjectRouter;
