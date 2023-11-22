const mongoose = require('mongoose');
const taskSchema = require('../schemas/Task');

const TaskModel = mongoose.model('task.list', taskSchema);

module.exports = TaskModel;
