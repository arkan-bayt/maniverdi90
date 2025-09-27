const mongoose = require('mongoose');

const importSchema = new mongoose.Schema({
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
importSchema.index({ productName: 'text', notes: 'text' });
importSchema.index({ date: -1 });

module.exports = mongoose.model('Import', importSchema);