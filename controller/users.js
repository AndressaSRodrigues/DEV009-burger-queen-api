const bcrypt = require('bcrypt');

const {
  User,
  find,
  findByEmail,
  findById,
  create,
  deleteById,
  updateById,
} = require('../models/users');

const getUsers = async (req, res) => {
  try {
    const users = await find();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Users not found' });
  }
};

const getUserByEmail = async (email, res) => {
  try {
    return await findByEmail(email);
  } catch (error) {
    return res.status(500).json({ message: 'User not found' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  };

  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
  });

  try {
    const newUser = await create(user);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: 'User creation failed.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await findById(uid);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Could not find user.' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const values = req.body;

    if (values.password) {
      values.password = bcrypt.hashSync(values.password, 10);
    }

    const updatedUser = await updateById(uid, values);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'User update failed.' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    await deleteById(uid);
    return res.status(200).json({ message: 'User deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'User delete failed.' });
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
