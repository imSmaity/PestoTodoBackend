const express = require('express');
const authenticate = require('../middlewares/authenticate');
const UserModel = require('../models/user.model');
const router = express.Router();

router
  .route('/')
  .post(async (req, res) => {
    try {
      const { name, email } = req.body;

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
      });
      await user.save();
      const payload = { _id: user._id, name: user.name, email: user.email };
      const token = authenticate(payload);

      res.status(202).send({
        success: true,
        message: 'New user created',
        userMessage: 'Register success',
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(403).send({
        success: false,
        message: 'New user creation failed',
        userMessage: 'Register failed',
      });
    }
  })
  .get(async (req, res) => {
    res.status(200).send({ success: true });
  });

module.exports = router;
