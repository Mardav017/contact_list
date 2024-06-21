const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.get("/", contactController.contact_index);

router.get("/search/:text", contactController.contact_search);

router.post("/save", contactController.contact_save);

router.put("/save/:id", contactController.contact_update);

router.get("/create", contactController.contact_create);

router.get("/edit/:id", contactController.contact_edit);

router.get("/detail/:id", contactController.contact_detail);

router.delete("/:id", contactController.contact_delete);

module.exports = router;