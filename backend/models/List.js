const mongoose = require('mongoose');

const listSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'List must belong to a user'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'List name is required'],
      trim: true,
      maxlength: [100, 'List name cannot exceed 100 characters']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('List', listSchema);
