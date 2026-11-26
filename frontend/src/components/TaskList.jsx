import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import TaskCard from './TaskCard.jsx';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'overdue', label: 'Overdue' }
];

export default function TaskList() {
  const {
    addTask,
    error,
    loadingData,
    selectedList,
    setError,
    setTaskFilter,
    setTaskQuery,
    stats,
    taskFilter,
    taskQuery,
    visibleTasks
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(event) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        deadline: deadline || null
      });
      setTitle('');
      setDescription('');
      setDeadline('');
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!selectedList) {
    return (
      <main className="task-area task-area-empty">
        <div className="empty-panel">
          <span className="eyebrow">No list selected</span>
          <h1>Start by creating your first list.</h1>
          <p>The PRD flow begins with list creation, then task creation inside that list.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="task-area">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Active list</p>
          <h1>{selectedList.name}</h1>
          <p className="hero-subtext">
            Keep momentum with quick add, overdue visibility, and per-user task history.
          </p>
        </div>

        <div className="hero-actions">
          <div className="summary-pill">
            <span>{stats.pendingCount} pending</span>
            <span>{stats.completedCount} completed</span>
          </div>
          <button className="btn-primary" onClick={() => setShowForm((state) => !state)}>
            {showForm ? 'Close composer' : 'New task'}
          </button>
        </div>
      </section>

      <section className="insight-grid">
        <article className="insight-card">
          <span>All tasks</span>
          <strong>{stats.totalTasks}</strong>
        </article>
        <article className="insight-card">
          <span>Completed</span>
          <strong>{stats.completedCount}</strong>
        </article>
        <article className="insight-card">
          <span>Overdue</span>
          <strong>{stats.overdueCount}</strong>
        </article>
      </section>

      {showForm && (
        <form className="add-task-form" onSubmit={handleAdd}>
          <div className="form-header">
            <div>
              <h2>Add a task</h2>
              <p>Capture the next action, notes, and an optional deadline.</p>
            </div>
          </div>

          <div className="field-grid">
            <label>
              <span>Title</span>
              <input
                className="input-title"
                type="text"
                placeholder="Ship onboarding polish"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoFocus
              />
            </label>

            <label>
              <span>Deadline</span>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </label>
          </div>

          <label>
            <span>Description</span>
            <textarea
              placeholder="Add context, acceptance notes, or reminders..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save task
            </button>
            {deadline && (
              <button type="button" className="btn-secondary" onClick={() => setDeadline('')}>
                Clear deadline
              </button>
            )}
          </div>
        </form>
      )}

      <section className="toolbar">
        <input
          type="search"
          placeholder="Search tasks by title or description"
          value={taskQuery}
          onChange={(event) => setTaskQuery(event.target.value)}
        />

        <div className="filter-group">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`filter-chip ${taskFilter === filter.id ? 'filter-chip-active' : ''}`}
              onClick={() => setTaskFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="message-banner">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')}>
            Dismiss
          </button>
        </div>
      )}

      {loadingData && <p className="status-text">Loading tasks...</p>}

      {!loadingData && visibleTasks.length === 0 && (
        <div className="empty-panel">
          <span className="eyebrow">Nothing here yet</span>
          <h2>No tasks match this view.</h2>
          <p>Try another filter, change your search, or add a new task to this list.</p>
        </div>
      )}

      <div className="task-list">
        {visibleTasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </main>
  );
}
