// CONTACT CRUD Routes
const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");


// Index route = GET
router.get("/", async (req, res) => {
  try {
    const allContacts = await Contact.find({});
    res.json(allContacts);
  } catch (error) {
    // console.error("Error fetching all contacts:", error);
    res.status(500).json({ msg: "Whoops something went wrong!" });
    console.log(error)
  }
});

//Show GET ID get individual contact
router.get("/:id", async (req, res) => {
  try {
    const oneContact = await Contact.findById(req.params.id);
    if (!oneContact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    res.json(oneContact);
  } catch (error) {
    // console.error("Error fetching contact by ID:", error);
    res.status(500).json({ msg: "Whoops something went wrong with oneContact!" });
    console.log(error)
  }
});

//New  - GET - Form

//Create - POST
router.post("/", async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.json(newContact);
  } catch (error) {
    // console.error("Error Posting contact: ", error);
    // res.status(500).json({msg: "Something went wrong in NewContact!!"})
    res.status(400).json({ msg: error.message }); // Or handle specific error cases here
    // console.log(error)
  }
});

// Edit Route - GET FOrm

// Update - PUT/PATCH
router.put("/:id", async (req, res) => {
  try {
    const updateContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updateContact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    res.json(updateContact);
  } catch (error) {
    res.status(500).json({msg: "Something went wrong in updateContact!!"})
    console.log(error)
}});

//Destroy route - DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleteContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deleteContact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    res.json(deleteContact);
  } catch (error) {
    {
      res.status(500).json({msg: "Something went wrong in deleteContact!!"})
      console.log(error);
  }
}});

module.exports = router;
