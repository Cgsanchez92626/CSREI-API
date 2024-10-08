// CONTACT CRUD Routes
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Contact = require("../models/contact");
const Property = require("../models/property")

// Index route = GET
router.get("/", async (req, res) => {
  try {
    const { filter, agentId } = req.query;

    if (!agentId) {
      return res.status(400).json({ msg: "Agent ID is required" });
    }

    let query = { agent: agentId };

    if (filter && filter !== "All") {
      query.contact_status = filter;
    }
    // console.log("Query: ", query);
    const contacts = await Contact.find(query);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ msg: "Whoops something went wrong!" });
    console.log(error);
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
    res
      .status(500)
      .json({ msg: "Whoops something went wrong with oneContact!" });
    console.log(error);
  }
});

//New  - GET - Form

//Create - POST
router.post("/", async (req, res) => {
  // console.log("Hello from Contact Post Route");
  try {
    // console.log("Request Body:", req.body); // Log the request body
    const {
      firstname,
      lastname,
      contact_type,
      contact_status,
      agent,
    } = req.body;
    if (!firstname || !lastname || !contact_type || !contact_status || !agent) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    const newContact = await Contact.create(req.body);
    res.json(newContact);
  } catch (error) {
    console.error("Error Posting contact: ", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ msg: "Validation Error", errors: error.errors });
    } else {
      res
        .status(500)
        .json({ msg: "Internal Server Error", error: error.message });
    }
  }
});

// Edit Route - GET FOrm

// Update - PUT/PATCH
router.put("/:id", async (req, res) => {
  // console.log("Hello from Contact Update Route");
  try {
    const updateContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensure the updated document is returned and validations are run
    );
    if (!updateContact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    res.json(updateContact);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong in updateContact!!" });
    console.log(error);
  }
});

//Destroy route - DELETE
router.delete("/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const contactId = req.params.id;

    const deleteContact = await Contact.findByIdAndDelete(contactId).session(session);
    if (!deleteContact) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ msg: "Contact not found" });
    }

    // Find the 'Admin' contact
    const adminContact = await Contact.findOne({
      contact_status: "Admin",
    }).session(session);
    if (!adminContact) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ msg: "Admin contact not found" });
    }

    // Update related properties to set their contact field to a default (e.g., Admin contact ID) or null
    await Property.updateMany(
      { contact: contactId },
      { $set: { contact: adminContact._id } },
      { session }
    );
    // Update the Admin contact's properties array to include properties from the deleted contact
    await Contact.findByIdAndUpdate(
      adminContact._id,
      { $addToSet: { properties: { $each: deleteContact.properties } } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json(deleteContact);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: "Something went wrong in deleteContact!!" });
    console.log(error);
  }
});

module.exports = router;
