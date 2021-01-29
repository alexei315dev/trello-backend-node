const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please include your email'],
        validate: {
            isAsync: true,
            validator: function (value, isValid) {
              const self = this;
              return self.constructor.findOne({ email: value })
                .exec(function (err, user) {
                  if (err) {
                    throw err;
                  }
                  else if (user) {
                    if (self.id === user.id) {  // if finding and saving then it's valid even for existing email
                      return isValid(true);
                    }
                    return isValid(false);
                  }
                  else {
                    return isValid(true);
                  }
                })
            },
            message: 'The email address is already taken!',
        }
    },
    username : {type: String, unique: true, required:true}, 
    password: {
        type: String,
        required: false
    },
    create_date: { type: Date, default: Date.now },
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'boards',
      },
    ],
    token: {
      type: String,
      required: false
    }
});

userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({
    _id: user._id,
    username: user.username,
    email: user.email,
    password: user.password
  }, process.env.TOKEN_SECRET);
  user.token = token;
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;