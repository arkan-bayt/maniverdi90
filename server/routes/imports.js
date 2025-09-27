const express = require('express');
const Import = require('../models/Import');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all imports with search and pagination
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

    const imports = await Import.find(query)
      .populate('createdBy', 'username')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip(skip);

    const total = await Import.countDocuments(query);
    const totalAmount = await Import.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      imports,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      },
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    console.error('Get imports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get import by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const importRecord = await Import.findById(req.params.id).populate('createdBy', 'username');
    if (!importRecord) {
      return res.status(404).json({ message: 'Import record not found' });
    }
    res.json(importRecord);
  } catch (error) {
    console.error('Get import error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new import
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productName, price, notes, date, time } = req.body;

    if (!productName || price === undefined) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const newImport = new Import({
      productName,
      price,
      notes,
      date: date ? new Date(date) : new Date(),
      time: time || new Date().toLocaleTimeString('en-US', { hour12: false }),
      createdBy: req.user._id
    });

    await newImport.save();
    await newImport.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Import record created successfully',
      import: newImport
    });
  } catch (error) {
    console.error('Create import error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update import
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

    const importRecord = await Import.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!importRecord) {
      return res.status(404).json({ message: 'Import record not found' });
    }

    res.json({
      message: 'Import record updated successfully',
      import: importRecord
    });
  } catch (error) {
    console.error('Update import error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete import
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const importRecord = await Import.findByIdAndDelete(req.params.id);
    if (!importRecord) {
      return res.status(404).json({ message: 'Import record not found' });
    }

    res.json({ message: 'Import record deleted successfully' });
  } catch (error) {
    console.error('Delete import error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get imports summary
router.get('/summary/stats', authenticateToken, async (req, res) => {
  try {
    const totalAmount = await Import.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const monthlyStats = await Import.aggregate([
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
    console.error('Get imports summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;