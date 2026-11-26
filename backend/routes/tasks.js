const express = require('express');
const Task = require('../models/Task');
const List = require('../models/List');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/:listId/tasks', async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.listId, userId: req.user._id });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const tasks = await Task.find({
      listId: req.params.listId,
      userId: req.user._id
    }).sort({ createdAt: 1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:listId/tasks', async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.listId, userId: req.user._id });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const { title, description, deadline } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await Task.create({
      userId: req.user._id,
      listId: req.params.listId,
      title: title.trim(),
      description: description ? description.trim() : '',
      deadline: deadline || null,
      completed: false
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, deadline, completed } = req.body;
    const updateFields = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: 'Task title is required' });
      }
      updateFields.title = title.trim();
    }
    if (description !== undefined) {
      updateFields.description = description.trim();
    }
    if (deadline !== undefined) {
      updateFields.deadline = deadline || null;
    }
    if (completed !== undefined) {
      updateFields.completed = completed;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
