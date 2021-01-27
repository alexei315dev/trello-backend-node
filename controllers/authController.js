const chalk = require("chalk");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('../auth/auth');

exports.loginUser = async (req, res, next) => {
    passport.authenticate('login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              const error = new Error('An error occurred.');
              return next(error);
            }
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
                const token = await user.generateAuthToken();
                return res.json({ token, user });
              }
            );
          } catch (error) {
            return next(error);
          }
        }
    )(req, res, next);
}

exports.registerUser = (req, res, next) => {
    passport.authenticate('signup', 
        async (err, user, info) => {
            res.json({
                message: 'Signup successful',
                user: user
            });
        },
        { session: false }
    )(req, res, next);
}

exports.getUser = async (req, res, next) => {
  try {
    const reqUser = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
    const user = await User.findById(reqUser.user._id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error
    })
  }
}