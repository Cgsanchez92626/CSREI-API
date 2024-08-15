// AGENT CRUD Routes
const express = require("express");
const router = express.Router();
const Agent = require("../models/agent");

// Index route = GET
router.get("/", async (req, res) => {
  try {
    const allAgents = await Agent.find({});
    res.json(allAgents);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong in allAgents!!" });
    console.log(error);
  }
});

//Show GET ID get individual agent
router.get("/:id", async (req, res) => {
  try {
    const oneAgent = await Agent.findById(req.params.id);
    if (!oneAgent) {
      return res.status(404).json({ msg: "Agent not found" });
    }
    res.json(oneAgent);
  } catch (error) {
    res.status(500).json({ msg: "Whoops something went wrong in oneAgent!!" });
    console.log(error);
  }
});

//New  - GET - Form

//Create - POST
router.post("/", async (req, res) => {
  try {
    //   console.log(req.body);
    const newAgent = await Agent.create(req.body);
    res.json(newAgent);
  } catch (error) {
    res.status(400).json({ msg: error.message });
    // res.status(500).json({ msg: "Whoops something went wrong in newAgent!!" });
    // console.log(error);
  }
});

// Edit Route - GET FOrm

// Update - PUT/PATCH
router.put("/:id", async (req, res) => {
  try {
    const updateAgent = await Agent.findByIdAndUpdate(req.params.id, req.body);
    if (!updateAgent) {
      return res.status(404).json({ msg: "Agent not found" });
    }
    res.json(updateAgent);
  } catch (error) {
    res.status(500).json({ msg: "Whoops something went wrong in updateAgent!!" });
    console.log(error);
  }
});

//Destroy route - DELETE
router.delete("/:id", async (req, res) => {
    try {
  const deleteAgent = await Agent.findByIdAndDelete(req.params.id);
  if (!deleteAgent) {
    return res.status(404).json({ msg: "Agent not found" });
  }
  res.json(deleteAgent);
} catch (error) {
    res.status(500).json({ msg: "Whoops something went wrong in deleteAgent!!" });
    console.log(error);
  }
});

module.exports = router;
