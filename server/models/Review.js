const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ['Event', 'Property'],
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

reviewSchema.index({ itemType: 1, item: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
