const bcrypt = require("bcrypt");
const User = require("../models/user");

const userLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/contact");
  }
  next();
};
const user_login_get = (req, res) => {
  res.render("user/login", { title: "Login" });
};

const user_login_post = async (req, res) => {
  const { username, password } = req.body;
  const emptyFields = [];
  if (!username) {
    emptyFields.push("username");
  }
  if (!password) {
    emptyFields.push("password");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ error: "User does not exist", invalid: "username" });
  }
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.userId = user._id;
    return res.json({ redirect: "/contact" });
  }

  res.status(400).json({ error: "Incorrect password", invalid: "password" });
};

const user_register_get = (req, res) => {
  res.render("user/register", { title: "Register" });
};

const user_register_post = async (req, res) => {
  const { username, email, password } = req.body;
  const emptyFields = [];
  if (!username) {
    emptyFields.push("username");
  }
  if (!email) {
    emptyFields.push("email");
  }
  if (!password) {
    emptyFields.push("password");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  const user =
    (await User.findOne({ username })) || (await User.findOne({ email }));
  if (user) {
    return res
      .status(400)
      .json({ error: "User already exists", invalid: "username" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userModel = new User({ username, email, password: hashedPassword });

  userModel
    .save()
    .then(() => {
      res.json({ redirect: "/user/login" });
    })
    .catch((err) => console.log(err));
};

const user_logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/user/login");
  });
};

module.exports = {
  userLoggedIn,
  user_login_get,
  user_login_post,
  user_register_get,
  user_register_post,
  user_logout,
};
