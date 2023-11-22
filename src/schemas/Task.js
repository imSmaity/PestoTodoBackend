const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: ['true', 'Title required'],
    },
    description: {
      type: String,
      trim: true,
      required: false,
      default: '',
    },
    status: {
      type: String,
      trim: true,
      required: ['true', 'Status required'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: { createdAt: 'cts', updatedAt: 'mts' },
    collection: 'task.list',
  },
);

module.exports = taskSchema;
