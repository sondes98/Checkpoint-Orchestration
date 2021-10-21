const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.mapped() });
    }
    const {
      parentsFullName,
      email,
      password,
      dateOfBirth,
      childsFirstName,
      childsLastName,
    } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      res.status(400).json({ message: "user already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      parentsFullName,
      childsLastName,
      childsFirstName,
      dateOfBirth,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        parents_full_name: newUser.parents_full_name,
        email: newUser.email,
        childsLastName: newUser.childsLastName,
        childsFirstName: newUser.childsFirstName,
        dateOfBirth: newUser.dateOfBirth,
        id: newUser._id,
        token: newUser.token,
      },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    res.status(200).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser) return res.status(400).json({ message: 'you must register first !' });
    const validatePassword = await bcrypt.compare(password, existUser.password);
    if (!validatePassword)
      return res.status(401).send({ message: 'Wrong password ! \n Try again!' });
    const token = jwt.sign(
      { id: existUser._id, email: existUser.email },
      process.env.SECRET_KEY
    );
    return res.json({ user: existUser, token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = { registerController, loginController };


