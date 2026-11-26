import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createList,
  createTask,
  deleteList,
  deleteTask,
  getCurrentUser,
  getLists,
  getStoredToken,
  getTasks,
  loginUser,
  registerUser,
  renameList,
  storeToken,
  updateTask
} from '../api.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [currentUser, setCurrentUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskQuery, setTaskQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setCurrentUser(data.user);
      } catch (err) {
        handleLogout();
      } finally {
        setLoadingAuth(false);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (!currentUser || !token) {
      setLists([]);
      setTasks([]);
      setSelectedListId(null);
      return;
    }

    fetchLists();
  }, [currentUser, token]);

  useEffect(() => {
    if (!currentUser || !token || !selectedListId) {
      setTasks([]);
      return;
    }

    fetchTasks(selectedListId);
  }, [currentUser, token, selectedListId]);

  async function authenticate(action, payload) {
    setError('');
    setLoadingAuth(true);

    try {
      const data = action === 'login'
        ? await loginUser(payload)
        : await registerUser(payload);

      setToken(data.token);
      storeToken(data.token);
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoadingAuth(false);
    }
  }

  async function fetchLists() {
    try {
      setLoadingData(true);
      setError('');
      const data = await getLists(token);
      setLists(data);
      setSelectedListId((currentSelected) => {
        if (!data.length) return null;
        const stillExists = data.some((list) => list._id === currentSelected);
        return stillExists ? currentSelected : data[0]._id;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  }

  async function fetchTasks(listId) {
    try {
      setLoadingData(true);
      setError('');
      const data = await getTasks(token, listId);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  }

  function handleLogout() {
    storeToken(null);
    setToken(null);
    setCurrentUser(null);
    setLists([]);
    setTasks([]);
    setSelectedListId(null);
    setTaskQuery('');
    setTaskFilter('all');
    setError('');
  }

  async function addList(name) {
    const newList = await createList(token, name);
    setLists((prev) => [...prev, newList]);
    setSelectedListId(newList._id);
    return newList;
  }

  async function updateListName(id, name) {
    const updated = await renameList(token, id, name);
    setLists((prev) => prev.map((list) => (list._id === id ? updated : list)));
    return updated;
  }

  async function removeList(id) {
    await deleteList(token, id);
    setLists((prev) => {
      const remaining = prev.filter((list) => list._id !== id);
      setSelectedListId((currentSelected) => {
        if (currentSelected !== id) return currentSelected;
        return remaining[0]?._id || null;
      });
      return remaining;
    });
  }

  async function addTask(fields) {
    const created = await createTask(token, selectedListId, fields);
    setTasks((prev) => [...prev, created]);
    return created;
  }

  async function saveTask(id, fields) {
    const updated = await updateTask(token, id, fields);
    setTasks((prev) => prev.map((task) => (task._id === id ? updated : task)));
    return updated;
  }

  async function removeTask(id) {
    await deleteTask(token, id);
    setTasks((prev) => prev.filter((task) => task._id !== id));
  }

  const selectedList = useMemo(
    () => lists.find((list) => list._id === selectedListId) || null,
    [lists, selectedListId]
  );

  const visibleTasks = useMemo(() => {
    const query = taskQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesQuery =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);

      if (!matchesQuery) return false;

      if (taskFilter === 'completed') return task.completed;
      if (taskFilter === 'pending') return !task.completed;
      if (taskFilter === 'overdue') {
        return !task.completed && task.deadline && new Date(task.deadline) < new Date();
      }

      return true;
    });
  }, [taskFilter, taskQuery, tasks]);

  const stats = useMemo(() => {
    const completedCount = tasks.filter((task) => task.completed).length;
    const overdueCount = tasks.filter(
      (task) => !task.completed && task.deadline && new Date(task.deadline) < new Date()
    ).length;

    return {
      totalLists: lists.length,
      totalTasks: tasks.length,
      completedCount,
      pendingCount: tasks.length - completedCount,
      overdueCount
    };
  }, [lists.length, tasks]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        error,
        lists,
        loadingAuth,
        loadingData,
        selectedList,
        selectedListId,
        setError,
        setSelectedListId,
        stats,
        taskFilter,
        setTaskFilter,
        taskQuery,
        setTaskQuery,
        tasks,
        visibleTasks,
        login: (payload) => authenticate('login', payload),
        register: (payload) => authenticate('register', payload),
        logout: handleLogout,
        addList,
        updateListName,
        removeList,
        addTask,
        saveTask,
        removeTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
