import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import TaskList from './components/TaskList.jsx';

function AppShell() {
  const { currentUser, loadingAuth } = useApp();

  if (loadingAuth) {
    return (
      <div className="screen-shell">
        <div className="loading-panel">
          <span className="loading-kicker">Syncing workspace</span>
          <h1>Preparing your planner</h1>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="app-shell">
      <div className="app-backdrop" />
      <div className="app-layout">
        <Sidebar />
        <TaskList />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
