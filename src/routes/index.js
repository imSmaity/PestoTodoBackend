const express = require('express');
const authorize = require('../middlewares/authorize');
const {
  userRegister,
  userLogin,
  userSynchronize,
} = require('../controllers/user.controller');
const {
  createTask,
  updateTask,
  deleteTask,
  filterTasks,
} = require('../controllers/task.controller');
const router = express.Router();

router.route('/user').post(userRegister);
router.route('/user/login').post(userLogin);
router.route('/user/synchronize').get(authorize, userSynchronize);
router
  .route('/user/task')
  .post(authorize, createTask)
  .put(authorize, updateTask);

router.route('/user/task/:task_id').delete(authorize, deleteTask);
router.get('/user/task/filter', authorize, filterTasks);

module.exports = router;
