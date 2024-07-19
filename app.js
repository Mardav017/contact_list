require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
// const dbURI = "mongodb://localhost:27017/demo";
const dbURI = process.env.dbURI;

// Session 
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbURI,
    }),
    cookie: { maxAge: 180 * 60 * 1000 }, // 3 hours
  })
);

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/user/login");
  }
  next();
};

// Routes

//contact routes
app.use("/contact", authMiddleware, contactRoutes);

//user routes
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.redirect("/contact");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404 Page not found" });
});

// Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
