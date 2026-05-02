const express = require('express');

const createActivitiesRouter = (db) => {
  const router = express.Router();

  // Get project activities
  router.get('/projects/:projectId', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      
      const snapshot = await db
        .collection('activities')
        .where('projectId', '==', req.params.projectId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const activities = [];
      snapshot.forEach(doc => {
        activities.push({ id: doc.id, ...doc.data() });
      });

      res.json(activities);
    } catch (error) {
      console.error('Error getting project activities:', error);
      res.status(500).json({ error: 'Failed to get activities' });
    }
  });

  // Get task activities
  router.get('/tasks/:taskId', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      
      const snapshot = await db
        .collection('activities')
        .where('taskId', '==', req.params.taskId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const activities = [];
      snapshot.forEach(doc => {
        activities.push({ id: doc.id, ...doc.data() });
      });

      res.json(activities);
    } catch (error) {
      console.error('Error getting task activities:', error);
      res.status(500).json({ error: 'Failed to get activities' });
    }
  });

  return router;
};

module.exports = createActivitiesRouter;
