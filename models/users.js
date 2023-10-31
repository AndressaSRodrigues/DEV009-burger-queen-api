const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'waiter', 'chef'] }
});

const User = mongoose.model('User', UserSchema);

async function find () {
  return await User.find({});
};

async function findByEmail(email) {
  return await User.findOne({ email });
};

async function findById(id) {
  return await User.findById(id);
};

async function create(user) {
  return await User.create(user);
};

async function deleteById(id){
  return await User.findOneAndDelete({ _id: id });
};

async function updateById(id, values){
  return await User.findByIdAndUpdate(id, values, { new: true, runValidators: true });
};

module.exports = {
  User,
  UserSchema,
  find,
  findByEmail,
  findById,
  create,
  deleteById,
  updateById
};
