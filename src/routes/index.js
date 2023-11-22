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
} = require('../controllers/task.controller');
const router = express.Router();

router.route('/user').post(userRegister).get(userLogin);
router.route('/user/synchronize').get(authorize, userSynchronize);
router
  .route('/user/task')
  .post(authorize, createTask)
  .put(authorize, updateTask)
  .delete(authorize, deleteTask);

module.exports = router;
