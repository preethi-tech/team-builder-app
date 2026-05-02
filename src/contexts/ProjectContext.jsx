import { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const ProjectContext = createContext({});

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    // Get user's projects
    const q = query(
      collection(db, 'projects'),
      where('members', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectList = [];
        snapshot.forEach((doc) => {
          projectList.push({ id: doc.id, ...doc.data() });
        });
        setProjects(projectList);
        
        // Set first project as current if none selected
        if (!currentProject && projectList.length > 0) {
          setCurrentProject(projectList[0]);
        }
        
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const createProject = async (projectData) => {
    try {
      setError(null);
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        ownerId: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Log activity
      await addDoc(collection(db, 'activities'), {
        type: 'project_created',
        projectId: docRef.id,
        userId: user.uid,
        userName: user.displayName || user.email,
        data: { projectName: projectData.name },
        createdAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      setError(null);
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      setError(null);
      await deleteDoc(doc(db, 'projects', projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(projects[0] || null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addMember = async (projectId, memberEmail) => {
    try {
      setError(null);
      // In a real implementation, you'd look up the user by email
      // For now, this is a placeholder
      const projectRef = doc(db, 'projects', projectId);
      // You'd need to implement user lookup and add to members array
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    projects,
    currentProject,
    setCurrentProject,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    addMember
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
