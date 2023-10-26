const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
  User,
  
  getUsers: async () => {
    try {
      return await User.find();
    } catch (error) {
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  },

  createUser: async (user) => {
    try {
      return await User.create(user);
    } catch (error) {
      throw error;
    }
  },

  deleteUserById: async (id) => {
    try {
      return await User.findOneAndDelete({ _id: id });
    } catch (error) {
      throw error;
    }
  },

  updateUserById: async (id, values) => {
    try {
      return await User.findByIdAndUpdate(id, values);
    } catch (error) {
      throw error;
    }
  },
};

