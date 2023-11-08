const userController = require('../users');
const { User } = require('../../models/users');

describe('User Controller', () => {
  beforeEach(() => {
    User.find = jest.fn();
    User.create = jest.fn();
    User.findOne = jest.fn();
    User.findById = jest.fn();
    User.findByIdAndUpdate = jest.fn();
    User.findOneAndDelete = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ name: 'User1' }, { name: 'User2' }];
      User.find.mockResolvedValue(mockUsers);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUsers(req, res);

      expect(User.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
      expect(res.status(200).json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle an error and return a 500 status', async () => {
      const errorMessage = 'Users not found.';
      User.find.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getUsers(req, res);

      expect(User.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getUserByEmail', () => {
    it('should find a user by its email', async () => {
      const email = 'test@example.com';

      const user = { _id: '123ABC', email: 'test@example.com', password: '123', role: 'user' };

      User.findOne.mockResolvedValue(user);

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUserByEmail(email, res);

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledWith({ email });
    });

    it('should throw an error if the user is not found in the database', async () => {
      const email = 'any';

      const errorMessage = 'User not found.';
      User.findOne.mockRejectedValue(new Error(errorMessage));

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUserByEmail(email, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
          role: 'user',
        },
      };

      const createdUser = {
        _id: '123',
        email: req.body.email,
        role: req.body.role,
      };

      User.create.mockResolvedValue(createdUser);

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.createUser(req, res);

      expect(User.create).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(createdUser);
      expect(res.status(201).json).toHaveBeenCalledWith(createdUser);
    });

    it('should return an error message if a required field is missing', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          role: 'user',
        }
      }

      const errorMessage = 'Missing required fields.'
      User.create.mockRejectedValue(new Error(errorMessage));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.createUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle user creation failure and return a 500 status', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
          role: 'user',
        },
      };

      const errorMessage = 'Failed to create new user.';
      User.create.mockRejectedValue(new Error(errorMessage));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.createUser(req, res);

      expect(User.create).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getUserById', () => {
    it('should find a user by its ID', async () => {
      const req = { params: { uid: '123456UID' } };
      const user = { _id: '123ABC', email: 'test@example.com', password: '123', role: 'user' };
      User.findById.mockResolvedValue(user);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getUserById(req, res);

      expect(User.findById).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(res.status(200).json).toHaveBeenCalledWith(user);
    });

    it('should fail when the id is invalid or does not exist', async () => {
      const req = { params: { uid: '' } };
      const errorMessage = 'User not found.';

      User.findById.mockRejectedValue(errorMessage);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getUserById(req, res)

      expect(User.findById).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateUserById', () => {
    it('should update user information', async () => {

      const req = {
        params: {
          uid: '123456UID'
        },
        body: {
          role: 'admin',
        }
      };

      const editedUser = {
        role: req.body.role,
      };

      User.findByIdAndUpdate.mockResolvedValue(editedUser);

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.updateUserById(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(editedUser);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  it('should throw an error message if an error ocurred', async () => {
    const errorMessage = 'Failed to update user.';
    User.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: {
        uid: '***'
      },
      body: {
        role: 'admin',
      }
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await userController.updateUserById(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    expect(res.status).toHaveBeenCalledWith(500);
  });

  describe('deleteUserById', () => {
    it('should delete a user based on its id', async () => {
      const req = {
        params: {
          uid: '123456789'
        }
      };

      User.findOneAndDelete.mockResolvedValue({});

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.deleteUserById(req, res);

      expect(User.findOneAndDelete).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted.'});
      expect(res.status).toHaveBeenCalledWith(200);

    });

    it('should fail when the correct parameters are not passed', async () => {
      const req = {
        params: {
          uid: '---'
        }
      };

      const errorMessage = 'Failed to delete user.';

      User.findOneAndDelete.mockRejectedValue(new Error(errorMessage));

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.deleteUserById(req, res);

      expect(User.findOneAndDelete).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage});
      expect(res.status).toHaveBeenCalledWith(500);

    });
  });
});
