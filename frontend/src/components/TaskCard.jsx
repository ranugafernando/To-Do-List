import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

function formatDeadline(deadline) {
  if (!deadline) return 'No deadline';

  return new Date(deadline).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function isOverdue(deadline, completed) {
  return Boolean(deadline) && !completed && new Date(deadline) < new Date();
}

export default function TaskCard({ task }) {
  const { removeTask, saveTask, setError } = useApp();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ''
  );

  const overdue = isOverdue(task.deadline, task.completed);

  async function handleToggle() {
    try {
      await saveTask(task._id, { completed: !task.completed });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave() {
    if (!title.trim()) return;

    try {
      await saveTask(task._id, {
        title: title.trim(),
        description: description.trim(),
        deadline: deadline || null
      });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this task?')) return;

    try {
      await removeTask(task._id);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <article className={`task-card ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      {editing ? (
        <div className="task-edit-form">
          <label>
            <span>Title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label>
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
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

          <div className="form-actions">
            <button className="btn-primary" type="button" onClick={handleSave}>
              Save changes
            </button>
            <button className="btn-secondary" type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-view">
          <div className="task-main">
            <label className="task-checkbox-wrap">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggle}
                className="task-checkbox"
              />
              <span className="checkbox-visual" />
            </label>

            <div className="task-content">
              <div className="task-heading">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-badges">
                  {task.completed && <span className="task-badge">Completed</span>}
                  {overdue && <span className="task-badge task-badge-danger">Overdue</span>}
                </div>
              </div>

              {task.description && <p className="task-desc">{task.description}</p>}

              <div className="task-meta">
                <span>{formatDeadline(task.deadline)}</span>
              </div>
            </div>
          </div>

          <div className="task-actions">
            <button className="btn-secondary btn-small" type="button" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="btn-secondary btn-small btn-danger-soft" type="button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
