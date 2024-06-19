const express = require("express");
const mongoose = require("mongoose");
const Contact = require("./models/contact");

// Express app
const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const dbURI = "mongodb://localhost:27017/demo";
mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => {
  Contact.find()
    .sort({ name: 1 })
    .then((result) => {
      res.render("index", { title: "Home", heading: `Contact List`,data: result });
    })
    .catch((err) => {
      console.error("Error fetching contacts:", err);
    });
});

app.get("/contact/search/:text", (req, res) => {
  const text = req.params.text;
  Contact.find({
    name: new RegExp(text, "i"),
  })
    .then((result) => {
      res.render("index", {
        title: `Search Result for ${text}`,
        heading: `Search Result for ${text}`,
        data: result,
      });
    })
    .catch((err) => {
      res.render("index", {
        title: `Search Result for ${text}`,
        heading: `No Result found for ${text}`
      });
      console.error("Error fetching contacts:", err);
    });
});
app.post("/contact/save", (req, res) => {
  const contactModel = new Contact(req.body);
  contactModel
    .save()
    .then(() => {
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.error("Error saving contact:", err);
    });
});

app.put("/contact/save/:id", (req, res) => {
  const id = req.params.id;
  Contact.findByIdAndUpdate(id, req.body, { new: true })
    .then((result) => {
      if (!result) {
        return res.send("Contact not found");
      }
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.error("Error updating contact:", err);
    });
});

app.get("/contact/create", (req, res) => {
  res.render("form", { title: "Create Contact" });
});

app.get("/contact/edit/:id", (req, res) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((result) => {
      if (!result) {
        return res.send("Contact not found");
      }
      res.render("form", { title: "Edit Contact", data: result });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "Contact Not Found" });
      console.error("Error finding contact by id:", err);
    });
});

app.get("/contact/detail/:id", (req, res) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((result) => {
      if (!result) {
        return res.send("Contact not found");
      }
      res.render("details", { title: "Details", data: result });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "Contact Not Found" });
      console.error("Error fetching contact details:", err);
    });
});

app.delete("/contact/:id", (req, res) => {
  const id = req.params.id;
  Contact.findByIdAndDelete(id)
    .then(() => {
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.error("Error deleting contact:", err);
    });
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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
