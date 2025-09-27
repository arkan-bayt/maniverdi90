const mongoose = require('mongoose');

const exportSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  time: {
    type: String,
    required: true,
    default: () => new Date().toLocaleTimeString('en-US', { hour12: false })
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
exportSchema.index({ productName: 'text', notes: 'text' });
exportSchema.index({ date: -1 });

module.exports = mongoose.model('Export', exportSchema);