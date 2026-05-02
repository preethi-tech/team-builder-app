import { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useProjects } from './ProjectContext';

const TaskContext = createContext({});

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { currentProject } = useProjects();

  useEffect(() => {
    if (!user || !currentProject) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('projectId', '==', currentProject.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const taskList = [];
        snapshot.forEach((doc) => {
          taskList.push({ id: doc.id, ...doc.data() });
        });
        setTasks(taskList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, currentProject]);

  const createTask = async (taskData) => {
    try {
      setError(null);
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        projectId: currentProject.id,
        ownerId: user.uid,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Log activity
      await addDoc(collection(db, 'activities'), {
        type: 'task_created',
        taskId: docRef.id,
        projectId: currentProject.id,
        userId: user.uid,
        userName: user.displayName || user.email,
        data: { taskTitle: taskData.title },
        createdAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      setError(null);
      const taskRef = doc(db, 'tasks', taskId);
      const oldTask = tasks.find(t => t.id === taskId);
      
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      // Log status change activity
      if (updates.status && oldTask && updates.status !== oldTask.status) {
        await addDoc(collection(db, 'activities'), {
          type: 'task_status_changed',
          taskId,
          projectId: currentProject.id,
          userId: user.uid,
          userName: user.displayName || user.email,
          data: {
            taskTitle: oldTask.title,
            fromStatus: oldTask.status,
            toStatus: updates.status
          },
          createdAt: serverTimestamp()
        });
      }
      
      // Log assignment activity
      if (updates.assigneeId && oldTask && updates.assigneeId !== oldTask.assigneeId) {
        await addDoc(collection(db, 'activities'), {
          type: 'task_assigned',
          taskId,
          projectId: currentProject.id,
          userId: user.uid,
          userName: user.displayName || user.email,
          data: {
            taskTitle: oldTask.title,
            assigneeId: updates.assigneeId
          },
          createdAt: serverTimestamp()
        });
        
        // Create notification for assignee
        await addDoc(collection(db, 'notifications'), {
          userId: updates.assigneeId,
          type: 'task_assigned',
          taskId,
          title: 'New Task Assigned',
          message: `You have been assigned to task "${oldTask.title}"`,
          read: false,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError(null);
      await deleteDoc(doc(db, 'tasks', taskId));
      
      // Log activity
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await addDoc(collection(db, 'activities'), {
          type: 'task_deleted',
          projectId: currentProject.id,
          userId: user.uid,
          userName: user.displayName || user.email,
          data: { taskTitle: task.title },
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getMyTasks = () => {
    return tasks.filter(task => task.assigneeId === user.uid);
  };

  const value = {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getMyTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
