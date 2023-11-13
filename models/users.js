const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'waiter', 'chef'] },
});

const User = mongoose.model('User', UserSchema);

async function find() {
  return User.find({});
}

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findById(id) {
  return User.findById(id);
}

async function create(user) {
  return User.create(user);
}

async function deleteById(id) {
  return User.findOneAndDelete({ _id: id });
}

async function deleteByEmail(email){
  return User.findOneAndDelete({ email: email})
}

async function updateById(id, values) {
  return User.findByIdAndUpdate(id, values, { new: true });
}

async function updateByEmail(email, values) {
  return User.findOneAndUpdate( { email: email }, values, { new: true });
}

module.exports = {
  User,
  UserSchema,
  find,
  findByEmail,
  findById,
  create,
  deleteById,
  deleteByEmail,
  updateById,
  updateByEmail,
};
