const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

//Create Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please provide proper email address");
        }
      },
    },
    age: {
      type: Number,
      default: 24,
      validate(value) {
        if (value <= 0) {
          throw new Error("Please provide age with positive number");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.includes("password")) {
          throw new Error("Password does not contain 'password'");
        }
      },
    },
    tokens: [{
        token: {
          type: String,
          required: true,
        },
      }],
      avatar:{
        type: Buffer
      }
  },
  {
    timestamps: true,
  }
);

//Virtual method
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

//Customize user Object
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject(user);
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

//Custom method
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

/*
//Create custom DB method
userSchema.statics.findByCredentials = async function(email, password){
  cosole.log('email,password');
  consol.log(email,password)
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login!!!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login!!!");
  }
  return user;
};
*/

//Hashing Schema's property
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//Delete all tasks related to user when user gets deleted
userSchema.pre("remove", async function (next) {
  const user = this;
  const task = await Task.deleteMany({ owner: user._id });
  next();
});

//Model Creation
const User = mongoose.model("User", userSchema);

module.exports = User;
