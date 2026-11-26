import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function Sidebar() {
  const {
    addList,
    currentUser,
    lists,
    logout,
    removeList,
    selectedListId,
    setSelectedListId,
    stats,
    updateListName
  } = useApp();

  const [newListName, setNewListName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  async function handleCreate(event) {
    event.preventDefault();
    if (!newListName.trim()) return;

    await addList(newListName.trim());
    setNewListName('');
  }

  function startEdit(list) {
    setEditingId(list._id);
    setEditingName(list.name);
  }

  async function handleRename(id) {
    if (!editingName.trim()) return;
    await updateListName(id, editingName.trim());
    setEditingId(null);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this list and all of its tasks?')) return;
    await removeList(id);
  }

  return (
    <aside className="sidebar">
      <div className="brand-panel">
        <p className="brand-tag">Fern Flow</p>
        <h2>Daily command center</h2>
        <span>Plan fast. Track clearly. Finish on time.</span>
      </div>

      <div className="user-panel">
        <div>
          <strong>{currentUser.name}</strong>
          <p>{currentUser.email}</p>
        </div>
        <button className="btn-secondary btn-small" onClick={logout}>
          Log out
        </button>
      </div>

      <div className="sidebar-stats">
        <div>
          <span>Lists</span>
          <strong>{stats.totalLists}</strong>
        </div>
        <div>
          <span>Tasks</span>
          <strong>{stats.totalTasks}</strong>
        </div>
        <div>
          <span>Overdue</span>
          <strong>{stats.overdueCount}</strong>
        </div>
      </div>

      <div className="sidebar-section-title">
        <span>Your lists</span>
      </div>

      <ul className="list-nav">
        {lists.map((list) => (
          <li
            key={list._id}
            className={`list-item ${selectedListId === list._id ? 'active' : ''}`}
          >
            {editingId === list._id ? (
              <div className="inline-edit">
                <input
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleRename(list._id);
                    if (event.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-secondary btn-small"
                  onClick={() => handleRename(list._id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="list-row" onClick={() => setSelectedListId(list._id)}>
                <span className="list-name">{list.name}</span>
                <div className="list-actions">
                  <button
                    type="button"
                    className="list-action"
                    onClick={(event) => {
                      event.stopPropagation();
                      startEdit(list);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="list-action list-action-danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(list._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form className="new-list-form" onSubmit={handleCreate}>
        <label htmlFor="new-list-name">Add a list</label>
        <input
          id="new-list-name"
          type="text"
          placeholder="Sprint tasks, Personal, Reading..."
          value={newListName}
          onChange={(event) => setNewListName(event.target.value)}
        />
        <button type="submit" className="btn-primary btn-block">
          Create list
        </button>
      </form>
    </aside>
  );
}
