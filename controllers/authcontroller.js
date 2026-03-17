const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require('../utils/sendemail')

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user1 = await User.create({
      name,
      email,
      password: hashed,
    });
    const token = jwt.sign({ id: user1._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
       await sendEmail(
    email,
    'Welcome to AuthApp!',
    `<h1>Welcome ${name}!</h1><p>Your account has been created successfully.</p>`
)
    return res
      .status(201)
      .json({ message: "User created successfully", token });
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        res.status(200).json(user)
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}




module.exports = { signup, login, getMe }

