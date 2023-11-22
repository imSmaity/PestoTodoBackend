const mongoose = require('mongoose');
const userSchema = require('../schemas/User');

const UserModel = mongoose.model('user.list', userSchema);

module.exports = UserModel;
