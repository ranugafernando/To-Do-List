const express = require('express');
const List = require('../models/List');
const Task = require('../models/Task');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'List name is required' });
    }

    const list = await List.create({
      userId: req.user._id,
      name: name.trim()
    });

    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'List name is required' });
    }

    const list = await List.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.status(200).json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    await Task.deleteMany({ listId: req.params.id, userId: req.user._id });
    res.status(200).json({ message: 'List and all its tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
