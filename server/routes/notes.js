const express = require('express');
const Note = require('../models/Note');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all notes with search and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, category, priority, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notes = await Note.find(query)
      .populate('createdBy', 'username')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip(skip);

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get note by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('createdBy', 'username');
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new note
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newNote = new Note({
      title,
      content,
      category: category || 'general',
      priority: priority || 'medium',
      createdBy: req.user._id
    });

    await newNote.save();
    await newNote.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Note created successfully',
      note: newNote
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (priority) updateData.priority = priority;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notes statistics
router.get('/summary/stats', authenticateToken, async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments();
    
    const categoryStats = await Note.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const priorityStats = await Note.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalNotes,
      categoryStats,
      priorityStats
    });
  } catch (error) {
    console.error('Get notes stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;