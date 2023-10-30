const mongoose = require('mongoose');
const { UserSchema } = require('../models/users');

const User = mongoose.model('User', UserSchema);

  
async function getUsers () {
  return await User.find({});
}

async function getUserByEmail(email) {
  return await User.findOne({ email });
}

async function getUserById(id) {
  return await User.findById(id);
}

async function createUser(user) {
  return await User.create(user);
}

async function deleteUserById(id){
  return await User.findOneAndDelete({ _id: id });
}

async function updateUserById(id, values){
  return await User.findByIdAndUpdate(id, values);
}

module.exports = {
  User,
  getUsers,
  getUserByEmail,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById
}
