const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
/* const cloudinary = require("../helpers/Cloudinary");
 */

const registerController = async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.mapped() });
    }
    const {
      email,
      Cgender,
      Pgender,
      parentsFullName,
      childsLastName,
      childsFirstName,
      dateOfBirth,
      phone,
      password,

    }=req.body;
    
    const existUser = await User.findOne({ email });
    if (existUser) {
      res.status(400).json({ message: 'user already exist' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email, 
      Cgender,
      Pgender, 
      parentsFullName,
      childsLastName,
      childsFirstName,
      dateOfBirth,
      phone,
      password:hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );
    res.json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};


const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser)
      return res.status(400).json({ message: "you must register first !" });
    const validatePassword = await bcrypt.compare(password, existUser.password);
    if (!validatePassword)
      return res
        .status(401)
        .send({ message: "Wrong password ! \n Try again!" });
    const token = jwt.sign(
      {
        id: existUser._id,
        email: existUser.email,
        parentsFullName: existUser.parentsFullName,
        childsFirstName: existUser.childsFirstName,
      },
      process.env.SECRET_KEY
    );
    return res.json({ user: existUser, token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
const updateAccount = async (req, res) => {
  try {
    const {
      phone,
      email,
      Cgender,
      Pgender,
      parentsFullName,
      childsLastName,
      childsFirstName,
      dateOfBirth,
      password,
    } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      phone,
      email,
      Cgender,
      Pgender,
      parentsFullName,
      childsLastName,
      childsFirstName,
      dateOfBirth,
      password,
    });
    res.json({updatedUser});
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  }

};
const deleteAccount = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/* const updateImage = async (req, res) => {
  try {
    const imageInfo = await cloudinary.uploader.upload(req.file.path);
    const existUser = await User.findById(req.params.id);
    console.log(imageInfo);
    cloudinary.uploader.destroy(existUser.profilePic.public_id);
    const image = await User.findByIdAndUpdate(req.params.id, {
      profilePic: { imageURL: imageInfo.url, public_id: imageInfo.public_id },
    });
    res.json(image);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}; */

module.exports = {
/*   updateImage,
 */  registerController,
  loginController,
  updateAccount,
  getSingleUser,
  getUsers,
  deleteAccount,
};
