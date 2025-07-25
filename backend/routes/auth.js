require("dotenv").config({ path: "./config/config.env" });
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth")

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // check all the missing fields
  if (!firstname || !lastname || !email || !password)
    return res
      .status(400)
      .json({ error: `Please enter all the required field.` });

  // name validation
  if (firstname.length > 25)
    return res
      .status(400)
      .json({ error: "Firstname can only be less than 25 characters." });

  if (lastname.length > 25)
    return res
      .status(400)
      .json({ error: "Pastname can only be less than 25 characters." });

  // email validation
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });

  // password validation
  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be atleast 6 charaters long." });

  try {
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist)
      return res
        .status(400)
        .json({ error: `A user with email ${email} already exists!` });
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    //save the user
    const result = await newUser.save();
    result._doc.password = undefined;
    return res.status(201).json({ ...result._doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // check all the missing fields
  if (!email || !password)
    return res
      .status(400)
      .json({ error: `Please enter all the required field.` });

  // email validation
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });

  try {
    const userAlreadyExist = await User.findOne({ email });
    if (!userAlreadyExist)
      return res.status(400).json({ error: `Invalid email or password!` });

    // if there were any user present
    const doesPasswordMatch = await bcrypt.compare(
      password,
      userAlreadyExist.password
    );

    if (!doesPasswordMatch)
      return res.status(400).json({ error: `Invalid email or password!` });

    // generate token

    const payload = { _id: userAlreadyExist._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const user = {...userAlreadyExist._doc, password: undefined}
    return res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/me", auth, async(req, res) => {
  return res.status(200).json({...req.user._doc});
})

module.exports = router;
