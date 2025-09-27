const express = require('express');
const Employee = require('../models/Employee');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all employees with search and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy = 'startDate', sortOrder = 'desc' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const employees = await Employee.find(query)
      .populate('createdBy', 'username')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip(skip);

    const total = await Employee.countDocuments(query);
    const totalSalary = await Employee.aggregate([
      { $match: { ...query, isActive: true } },
      { $group: { _id: null, total: { $sum: '$monthlySalary' } } }
    ]);

    res.json({
      employees,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      },
      totalSalary: totalSalary[0]?.total || 0
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('createdBy', 'username');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new employee
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, jobTitle, monthlySalary, startDate } = req.body;

    if (!name || !jobTitle || monthlySalary === undefined || !startDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (monthlySalary < 0) {
      return res.status(400).json({ message: 'Salary cannot be negative' });
    }

    const newEmployee = new Employee({
      name,
      jobTitle,
      monthlySalary,
      startDate: new Date(startDate),
      createdBy: req.user._id
    });

    await newEmployee.save();
    await newEmployee.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, jobTitle, monthlySalary, startDate, isActive } = req.body;
    
    if (monthlySalary !== undefined && monthlySalary < 0) {
      return res.status(400).json({ message: 'Salary cannot be negative' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (jobTitle) updateData.jobTitle = jobTitle;
    if (monthlySalary !== undefined) updateData.monthlySalary = monthlySalary;
    if (startDate) updateData.startDate = new Date(startDate);
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee statistics
router.get('/summary/stats', authenticateToken, async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ isActive: true });
    const totalSalary = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$monthlySalary' } } }
    ]);

    const departmentStats = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$jobTitle', count: { $sum: 1 }, totalSalary: { $sum: '$monthlySalary' } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalEmployees,
      totalSalary: totalSalary[0]?.total || 0,
      departmentStats
    });
  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;