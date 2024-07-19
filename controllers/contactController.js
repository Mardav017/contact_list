const Contact = require("../models/contact");
const mongoose = require("mongoose");

const contact_index = (req, res) => {
  Contact.find({
    userId: req.session.userId,
  })
    .sort({ name: 1 })
    .collation({ locale: "en", strength: 2 })
    .then((result) => {
      res.render("contact/index", {
        title: "Home",
        heading: `Contact List`,
        data: result,
      });
    })
    .catch((err) => {
      console.error("Error fetching contacts:", err);
    });
};

const contact_search = (req, res) => {
  const text = req.params.text;
  Contact.find({
    name: new RegExp(text, "i"),
    userId: req.session.userId,
  })
    .then((result) => {
      res.render("contact/index", {
        title: `Search Result for ${text}`,
        heading: `Search Result for ${text}`,
        data: result,
      });
    })
    .catch((err) => {
      res.render("contact/index", {
        title: `Search Result for ${text}`,
        heading: `No Result found for ${text}`,
      });
      console.error("Error fetching contacts:", err);
    });
};

const contact_save = (req, res) => {
  req.body.userId = req.session.userId;
  const contactModel = new Contact(req.body);
  contactModel
    .save()
    .then(() => {
      res.json({ redirect: "/contact" });
    })
    .catch((err) => {
      console.error("Error saving contact:", err);
    });
};

const contact_update = (req, res) => {
  const id = req.params.id;
  Contact.findByIdAndUpdate(id, req.body, { new: true })
    .then((result) => {
      if (!result) {
        return res.send("Contact not found");
      }
      res.json({ redirect: "/contact" });
    })
    .catch((err) => {
      console.error("Error updating contact:", err);
    });
};

const contact_create = (req, res) => {
  res.render("contact/form", { title: "Create Contact" });
};

const contact_edit = (req, res) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((result) => {
      if (!result) {
        return res.send("Contact not found");
      }
      res.render("contact/form", { title: "Edit Contact", data: result });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "Contact Not Found" });
      console.error("Error finding contact by id:", err);
    });
};

const contact_detail = (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No such Workout");
  }

  Contact.findById(id)
    .then((result) => {
      if (!result) {
        return res.send("Contact not found");
      }
      res.render("contact/details", { title: "Details", data: result });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "Contact Not Found" });
      console.error("Error fetching contact details:", err);
    });
};

const contact_delete = (req, res) => {
  const id = req.params.id;
  Contact.findByIdAndDelete(id)
    .then(() => {
      res.json({ redirect: "/contact" });
    })
    .catch((err) => {
      console.error("Error deleting contact:", err);
    });
};

module.exports = {
  contact_index,
  contact_search,
  contact_save,
  contact_update,
  contact_create,
  contact_edit,
  contact_detail,
  contact_delete,
};
