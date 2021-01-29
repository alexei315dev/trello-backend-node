const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  registerUser: async (req, res) => {
    //checking if the user is already in the db
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exist');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword
    })

    //create a new user
    try {
      const savedUser = await user.save();
      const token = await savedUser.generateAuthToken();
      res.status(200).json({
        success: true,
        token: token
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'register user failed',
        error: error
      })
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if(!user) return res.status(400).json('Email is not found');

      const validPass = await user.isValidPassword(req.body.password);
      if (!validPass) return res.status(400).json('Invalid Password');

      const token = await user.generateAuthToken();
      
      res.status(200).json({
        success: true,
        token: token
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error
      })
    }
  },

  getUser: async (req, res) => {
    try {
      const token = req.header('authorization').split(' ')[1];
      const user = await User.findOne({ token: token });
      if(!user) res.status(400).json('invalid');
      res.status(200).json({
        success: true,
        user: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error
      })
    }
  }
}