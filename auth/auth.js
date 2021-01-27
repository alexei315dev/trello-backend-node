const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const UserModel = require('../models/User');

passport.use(
  'signup',
  new localStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const username = req.body.username;
        const user = await UserModel.create({
          username,
          email,
          password
        });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        console.log('user', user);
        if (!user) {
          return done(null, false, {
            message: 'User not found'
          });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, {
            message: 'Wrong Password'
          });
        }
        return done(null, user, {
          message: 'Logged in Successfully'
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy({
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);