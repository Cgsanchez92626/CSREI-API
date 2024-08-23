// PROPERTY CRUD Routes
const express = require("express");
const router = express.Router();
const Property = require("../models/property");

// Index route = GET 
// GET Route for filtering property by contact reference
router.get("/", async (req, res) => {
  // console.log("Hello from Property Route");
  try {
    const { contactId } = req.query;

    if (!contactId) {
      return res.status(400).json({ msg: "Contact ID is required" });
    }

    let query = { contact: contactId };
    // console.log("Query: ", query);
    const properties = await Property.find(query);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ msg: "Whoops something went wrong!" });
    console.log(error);
  }
});

//Show GET ID get individual property
router.get("/:id", async (req, res) => {
  try {
    const oneProperty = await Property.findById(req.params.id);

    // Check if oneProperty is null or undefined (document not found)
    if (!oneProperty) {
      return res.status(404).json({ msg: "Property not found" });
    }
    res.json(oneProperty);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong in oneProperty!!" });
    console.log(error);
  }
});

//New  - GET - Form

//Create - POST
router.post("/", async (req, res) => {
  try {
    const newProperty = await Property.create(req.body);
    res.json(newProperty);
  } catch (error) {
    res.status(400).json({ msg: error.message });
    // res.status(500).json({msg: "Something went wrong in NewProperty!!"})
    // console.log(error)
  }
});

// Edit Route - GET FOrm

// Update - PUT/PATCH
router.put("/:id", async (req, res) => {
  try {
    const updateProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updateProperty) {
      return res.status(404).json({ msg: "Property not found" });
    }
    res.json(updateProperty);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong in updateProperty!!" });
    console.log(error);
  }
});

//Destroy route - DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleteProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deleteProperty) {
      return res.status(404).json({ msg: "Property not found" });
    }
    res.json(deleteProperty);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong in deleteProperty!!" });
    console.log(error);
  }
});

module.exports = router;
