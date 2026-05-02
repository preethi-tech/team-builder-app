const express = require('express');

const createNotificationsRouter = (db) => {
  const router = express.Router();

  // Get user notifications
  router.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      
      const snapshot = await db
        .collection('notifications')
        .where('userId', '==', req.user.uid)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const notifications = [];
      snapshot.forEach(doc => {
        notifications.push({ id: doc.id, ...doc.data() });
      });

      res.json(notifications);
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({ error: 'Failed to get notifications' });
    }
  });

  // Mark notification as read
  router.put('/:id', async (req, res) => {
    try {
      const notificationDoc = await db.collection('notifications').doc(req.params.id).get();
      
      if (!notificationDoc.exists) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      if (notificationDoc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await db.collection('notifications').doc(req.params.id).update({
        read: true,
        readAt: db.FieldValue.serverTimestamp()
      });

      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  // Mark all notifications as read
  router.post('/read-all', async (req, res) => {
    try {
      const snapshot = await db
        .collection('notifications')
        .where('userId', '==', req.user.uid)
        .where('read', '==', false)
        .get();

      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.update(doc.ref, {
          read: true,
          readAt: db.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  });

  // Delete notification
  router.delete('/:id', async (req, res) => {
    try {
      const notificationDoc = await db.collection('notifications').doc(req.params.id).get();
      
      if (!notificationDoc.exists) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      if (notificationDoc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await db.collection('notifications').doc(req.params.id).delete();
      res.json({ message: 'Notification deleted' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  });

  return router;
};

module.exports = createNotificationsRouter;
