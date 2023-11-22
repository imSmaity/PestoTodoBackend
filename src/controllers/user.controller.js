const authenticate = require('../middlewares/authenticate');
const UserModel = require('../models/user.model');
const TaskModel = require('../models/task.model');
const hashPassword = require('../middlewares/hashPassword');
const verifyPassword = require('../middlewares/verifyPassword');

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check if this email id already registered or not
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      res.status(403).send({
        success: false,
        message: 'Email alrady exist',
        userMessage: 'Email already used',
      });
      return;
    }

    const user = new UserModel({
      name,
      email,
      password: await hashPassword(password),
    });
    const savedUser = await user.save();
    const selectedUser = await UserModel.findById(savedUser._id)
      .select('-_id -name -email')
      .exec();

    const payload = {
      _id: selectedUser._id,
      name: selectedUser.name,
      email: selectedUser.email,
    };
    const token = authenticate(payload);

    res.status(202).send({
      success: true,
      message: 'New user created',
      userMessage: 'Register success',
      token,
      user: selectedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'New user creation failed',
      userMessage: 'Register failed',
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await UserModel.findOne({ email }).select(
      '-_id -password',
    );

    if (!userExists || !verifyPassword(password, userExists.password)) {
      return res.status(404).send({
        success: false,
        message: 'User or password wrong',
        userMessage: 'Invalid email or password',
      });
    } else {
      const user = await UserModel.findById(userExists._id)
        .select('-_id -name -email')
        .exec();
      const tasks = await TaskModel.find({ user: user._id }).populate({
        path: 'user',
        model: UserModel,
        select: '-_id -name -email',
      });

      const payload = { _id: user._id, name: user.name, email: user.email };
      const token = authenticate(payload);
      return res.status(200).send({
        success: true,
        message: 'Login guarented',
        userMessage: 'Login success',
        token,
        user,
        tasks,
      });
    }
  } catch (error) {
    console.loog(error);
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      userMessage: 'An internal server error occurred.',
    });
  }
};

const userSynchronize = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id).select('-_id -name -email');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User or password wrong',
        userMessage: 'Invalid email or password',
      });
    } else {
      const tasks = await TaskModel.find({ user: user._id }).populate({
        path: 'user',
        model: UserModel,
        select: '-_id -name -email',
      });

      const payload = { _id: user._id, name: user.name, email: user.email };
      const token = authenticate(payload);
      return res.status(200).send({
        success: true,
        message: 'Access guarented',
        userMessage: 'Synchronized',
        token,
        user,
        tasks,
      });
    }
  } catch (error) {
    console.loog(error);
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      userMessage: 'An internal server error occurred.',
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userSynchronize,
};
