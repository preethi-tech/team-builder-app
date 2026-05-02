const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Express app setup
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Middleware to verify Firebase Auth token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Import routes
const tasksRouter = require('./routes/tasks');
const projectsRouter = require('./routes/projects');
const commentsRouter = require('./routes/comments');
const activitiesRouter = require('./routes/activities');
const notificationsRouter = require('./routes/notifications');

// Mount routes
app.use('/api/tasks', authenticate, tasksRouter(db));
app.use('/api/projects', authenticate, projectsRouter(db));
app.use('/api/comments', authenticate, commentsRouter(db));
app.use('/api/activities', authenticate, activitiesRouter(db));
app.use('/api/notifications', authenticate, notificationsRouter(db));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export Express app as Cloud Function
exports.api = functions.https.onRequest(app);

// Firestore Triggers

// Trigger when user is created
exports.onUserCreated = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    console.log('New user created:', userData.email);
    
    // Create activity log
    await db.collection('activities').add({
      type: 'user_joined',
      userId: context.params.userId,
      userEmail: userData.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return null;
  });

// Trigger when task status changes
exports.onTaskStatusChanged = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    if (before.status !== after.status) {
      console.log(`Task ${context.params.taskId} status changed from ${before.status} to ${after.status}`);
      
      // Create activity log
      await db.collection('activities').add({
        type: 'task_status_changed',
        taskId: context.params.taskId,
        projectId: after.projectId,
        fromStatus: before.status,
        toStatus: after.status,
        userId: after.assigneeId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Send notification to assignee
      if (after.assigneeId) {
        await db.collection('notifications').add({
          userId: after.assigneeId,
          type: 'task_status_changed',
          taskId: context.params.taskId,
          title: 'Task Status Updated',
          message: `Task "${after.title}" moved from ${before.status} to ${after.status}`,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
    
    return null;
  });

// Trigger when task is assigned
exports.onTaskAssigned = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    if (before.assigneeId !== after.assigneeId && after.assigneeId) {
      console.log(`Task ${context.params.taskId} assigned to ${after.assigneeId}`);
      
      // Create activity log
      await db.collection('activities').add({
        type: 'task_assigned',
        taskId: context.params.taskId,
        projectId: after.projectId,
        assigneeId: after.assigneeId,
        userId: after.assigneeId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Send notification to assignee
      await db.collection('notifications').add({
        userId: after.assigneeId,
        type: 'task_assigned',
        taskId: context.params.taskId,
        title: 'New Task Assigned',
        message: `You have been assigned to task "${after.title}"`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return null;
  });

// Trigger when comment is added
exports.onCommentAdded = functions.firestore
  .document('comments/{commentId}')
  .onCreate(async (snap, context) => {
    const comment = snap.data();
    
    console.log(`Comment added to task ${comment.taskId}`);
    
    // Create activity log
    await db.collection('activities').add({
      type: 'comment_added',
      taskId: comment.taskId,
      commentId: context.params.commentId,
      authorId: comment.authorId,
      projectId: comment.projectId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Check for mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = comment.content.match(mentionRegex);
    
    if (mentions) {
      for (const mention of mentions) {
        const username = mention.substring(1);
        // Find user by username (you'd need to implement this)
        // For now, skip mention notifications
      }
    }
    
    return null;
  });

// Scheduled function to check for overdue tasks
exports.checkOverdueTasks = functions.pubsub
  .schedule('0 9 * * *') // Run daily at 9 AM
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const now = new Date();
    const snapshot = await db
      .collection('tasks')
      .where('dueDate', '<', now)
      .where('status', '!=', 'done')
      .get();
    
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      const task = doc.data();
      
      // Send notification to assignee
      const notificationRef = db.collection('notifications').doc();
      batch.set(notificationRef, {
        userId: task.assigneeId,
        type: 'task_overdue',
        taskId: doc.id,
        title: 'Task Overdue',
        message: `Task "${task.title}" is overdue`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log(`Checked overdue tasks, found ${snapshot.size} overdue`);
    
    return null;
  });
