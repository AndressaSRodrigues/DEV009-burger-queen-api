const bcrypt = require('bcrypt');

const {
  find,
  findByEmail,
  findById,
  create,
  deleteById,
  updateById,
  updateByEmail,
  deleteByEmail,
} = require('../models/users');

const getUsers = async (req, res) => {
  try {
    const users = await find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Users not found.' });
  }
};

const getUserByEmail = async (email, res) => {
  try {
    return await findByEmail(email);
  } catch (error) {
    return res.status(404).json({ message: 'User not found.' });
  }
};

const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const existingUser = await findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const user = {
      email,
      password: bcrypt.hashSync(password, 10),
      role,
    };

    const newUser = await create(user);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create new user.' });
  }
};

const getOneUser = async (req, res) => {
  const { uid } = req.params;

  try {
    let user;

    if (uid.includes('@')){
      user = await findByEmail(uid);
    } else {
      user = await findById(uid);
    }

    if(!user){
      return res.status(404).json({ message: 'User not found'});
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user.' });
  }
};

const updateUser = async (req, res) => {
  const { uid } = req.params;
  const values = req.body;

  if(!values.email && !values.password && !values.role){
    return res.status(400).json({ message: 'No fields to update.' });
  }

  if (values.password) {
    values.password = bcrypt.hashSync(values.password, 10);
  }

  try {
    let user;
    let updatedUser;

    if(uid.includes('@')){
      user = await findByEmail(uid);
      updatedUser = await updateByEmail(uid, values);
    } else {
      user = await findById(uid);
      updatedUser = await updateById(uid, values);
    }

    if(!user){
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user.' });
  }
};

const deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    let user;
    if(uid.includes('@')){
      user = await findByEmail(uid);

      if(!user){
        return res.status(404).json({ message: 'User not found.' });
      }

      await deleteByEmail(uid);
    } else {
      user = await findById(uid);

      if(!user){
        return res.status(404).json({ message: 'User not found.' });
      }

      await deleteById(uid);
    }
    return res.status(200).json({ message: 'User deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  getOneUser,
  updateUser,
  deleteUser,
};
