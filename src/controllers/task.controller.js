const UserModel = require('../models/user.model');
const TaskModel = require('../models/task.model');
const mongoose = require('mongoose');

const createTask = async (req, res) => {
  try {
    const { _id } = req.user;
    const { title, status, description } = req.body;
    const user = await UserModel.findById(_id).select('_id');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
        userMessage: 'The requested user was not found',
      });
    } else if (!title.trim()) {
      return res.status(400).send({
        success: false,
        message: 'Title is required',
        userMessage: 'Please provide a title for the task.',
      });
    } else if (!Number(status)) {
      return res.status(400).send({
        success: false,
        message: 'Status is required',
        userMessage: 'Please provide status.',
      });
    } else {
      const task = new TaskModel({
        user: new mongoose.Types.ObjectId(user._id),
        title,
        description: description || '',
        status,
      });
      await task.save();
      const tasks = await TaskModel.find({ user: user._id }).populate({
        path: 'user',
        model: UserModel,
        select: 'name email',
      });
      return res.status(201).send({
        success: true,
        message: 'Task created successfully',
        userMessage: 'Task has been successfully created.',
        tasks,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      userMessage: 'An internal server error occurred.',
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { _id } = req.user;
    const { task_id, title, status, description } = req.body;
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
        userMessage: 'The requested user was not found',
      });
    } else if (!title.trim()) {
      return res.status(400).send({
        success: false,
        message: 'Title is required',
        userMessage: 'Please provide a title for the task.',
      });
    } else if (!Number(status)) {
      return res.status(400).send({
        success: false,
        message: 'Status is required',
        userMessage: 'Please provide status.',
      });
    } else {
      const task = await TaskModel.findById(task_id).select('_id');
      if (!task) {
        return res.status(404).send({
          success: false,
          message: 'Task not found',
          userMessage: 'The update requested task was not found',
        });
      } else {
        await TaskModel.findByIdAndUpdate(task._id, {
          title,
          status,
          description: description || '',
        });
        const tasks = await TaskModel.find({ user: user._id }).populate({
          path: 'user',
          model: UserModel,
          select: 'name email',
        });
        return res.status(200).send({
          success: true,
          message: 'Task updated successfully',
          userMessage: 'Task has been updated successfully.',
          tasks,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      userMessage: 'An internal server error occurred.',
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { _id } = req.user;
    const { task_id } = req.params;
    const user = await UserModel.findById(_id).select('_id');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
        userMessage: 'The requested user was not found',
      });
    } else {
      const task = await TaskModel.findById(task_id).select('_id');
      if (!task) {
        return res.status(404).send({
          success: false,
          message: 'Task not found',
          userMessage: 'The update requested task was not found',
        });
      } else {
        await TaskModel.findByIdAndDelete(task._id);
        const tasks = await TaskModel.find({ user: user._id }).populate({
          path: 'user',
          model: UserModel,
          select: 'name email',
        });
        return res.status(200).send({
          success: true,
          message: 'Task updated successfully',
          userMessage: 'Task has been updated successfully.',
          tasks,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      userMessage: 'An internal server error occurred.',
    });
  }
};

const filterTasks = async (req, res) => {
  try {
    const { _id } = req.user;
    const { status } = req.query;
    const user = await UserModel.findById(_id).select('_id');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
        userMessage: 'The requested user was not found',
      });
    } else {
      if (Number(status) === 0) {
        const tasks = await TaskModel.find({
          user: user._id,
        }).populate({
          path: 'user',
          model: UserModel,
          select: 'name email',
        });

        return res.status(200).send({
          success: true,
          message: 'Tasks filtered successfully',
          userMessage: 'Tasks has been filtered.',
          tasks,
        });
      }
      const tasks = await TaskModel.find({
        user: user._id,
        status,
      }).populate({
        path: 'user',
        model: UserModel,
        select: 'name email',
      });

      return res.status(200).send({
        success: true,
        message: 'Tasks filtered successfully',
        userMessage: 'Tasks has been filtered.',
        tasks,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      userMessage: 'An internal server error occurred.',
    });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  filterTasks,
};
