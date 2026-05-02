const express = require('express');
const { z } = require('zod');

const createCommentsRouter = (db) => {
  const router = express.Router();

  // Validation schemas
  const createCommentSchema = z.object({
    taskId: z.string(),
    projectId: z.string(),
    content: z.string().min(1).max(5000)
  });

  const updateCommentSchema = z.object({
    content: z.string().min(1).max(5000)
  });

  // Add comment to task
  router.post('/tasks/:taskId', async (req, res) => {
    try {
      const data = createCommentSchema.parse({
        ...req.body,
        taskId: req.params.taskId
      });
      
      const commentRef = await db.collection('comments').add({
        ...data,
        authorId: req.user.uid,
        createdAt: db.FieldValue.serverTimestamp(),
        updatedAt: db.FieldValue.serverTimestamp()
      });

      res.status(201).json({ id: commentRef.id, ...data });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  // Get comments for task
  router.get('/tasks/:taskId', async (req, res) => {
    try {
      const snapshot = await db
        .collection('comments')
        .where('taskId', '==', req.params.taskId)
        .orderBy('createdAt', 'asc')
        .get();

      const comments = [];
      snapshot.forEach(doc => {
        comments.push({ id: doc.id, ...doc.data() });
      });

      res.json(comments);
    } catch (error) {
      console.error('Error getting comments:', error);
      res.status(500).json({ error: 'Failed to get comments' });
    }
  });

  // Update comment
  router.put('/:id', async (req, res) => {
    try {
      const data = updateCommentSchema.parse(req.body);
      
      const commentDoc = await db.collection('comments').doc(req.params.id).get();
      
      if (!commentDoc.exists) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (commentDoc.data().authorId !== req.user.uid) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await db.collection('comments').doc(req.params.id).update({
        ...data,
        updatedAt: db.FieldValue.serverTimestamp()
      });

      res.json({ id: req.params.id, ...data });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'Failed to update comment' });
    }
  });

  // Delete comment
  router.delete('/:id', async (req, res) => {
    try {
      const commentDoc = await db.collection('comments').doc(req.params.id).get();
      
      if (!commentDoc.exists) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (commentDoc.data().authorId !== req.user.uid) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await db.collection('comments').doc(req.params.id).delete();
      res.json({ message: 'Comment deleted' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  });

  return router;
};

module.exports = createCommentsRouter;
