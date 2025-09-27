const express = require('express');
const Export = require('../models/Export');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all exports with search and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const exports = await Export.find(query)
      .populate('createdBy', 'username')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip(skip);

    const total = await Export.countDocuments(query);
    const totalAmount = await Export.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      exports,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      },
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    console.error('Get exports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get export by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const exportRecord = await Export.findById(req.params.id).populate('createdBy', 'username');
    if (!exportRecord) {
      return res.status(404).json({ message: 'Export record not found' });
    }
    res.json(exportRecord);
  } catch (error) {
    console.error('Get export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new export
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productName, price, notes, date, time } = req.body;

    if (!productName || price === undefined) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const newExport = new Export({
      productName,
      price,
      notes,
      date: date ? new Date(date) : new Date(),
      time: time || new Date().toLocaleTimeString('en-US', { hour12: false }),
      createdBy: req.user._id
    });

    await newExport.save();
    await newExport.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Export record created successfully',
      export: newExport
    });
  } catch (error) {
    console.error('Create export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update export
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { productName, price, notes, date, time } = req.body;
    
    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const updateData = {};
    if (productName) updateData.productName = productName;
    if (price !== undefined) updateData.price = price;
    if (notes !== undefined) updateData.notes = notes;
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = time;

    const exportRecord = await Export.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!exportRecord) {
      return res.status(404).json({ message: 'Export record not found' });
    }

    res.json({
      message: 'Export record updated successfully',
      export: exportRecord
    });
  } catch (error) {
    console.error('Update export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete export
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const exportRecord = await Export.findByIdAndDelete(req.params.id);
    if (!exportRecord) {
      return res.status(404).json({ message: 'Export record not found' });
    }

    res.json({ message: 'Export record deleted successfully' });
  } catch (error) {
    console.error('Delete export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exports summary
router.get('/summary/stats', authenticateToken, async (req, res) => {
  try {
    const totalAmount = await Export.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const monthlyStats = await Export.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      totalAmount: totalAmount[0]?.total || 0,
      monthlyStats
    });
  } catch (error) {
    console.error('Get exports summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;