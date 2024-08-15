// PROPERTY CRUD Routes
const express = require('express')
const router = express.Router()
const Property = require('../models/property')

// Index route = GET and 
// GET Route for filtering property by zipcode
router.get('/', async (req, res) => {
    try {
        const { zipcode } = req.query;

        if (zipcode) {
            const filteredProperties = await Property.find({ zipcode: zipcode });
              if (filteredProperties.length == 0) {
                return res.status(404).json({ msg: "No Properties exist for that zipcode" });
              }
            res.json(filteredProperties);
        } else {
            const allProperties = await Property.find({});
            res.json(allProperties);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Something went wrong in Get Property!!" });
    }
});

//Show GET ID get individual property
router.get('/:id', async (req, res) => {
    try {
    const oneProperty = await Property.findById(req.params.id)

    // Check if oneProperty is null or undefined (document not found)
    if (!oneProperty) {
       return res.status(404).json({ msg: 'Property not found' });
    }
    res.json(oneProperty)
   
  } catch (error) {
    res.status(500).json({msg: "Something went wrong in oneProperty!!"})
    console.log(error)
}})

//New  - GET - Form

//Create - POST
router.post("/", async (req, res)=> {
  try {
    const newProperty = await Property.create(req.body)
    res.json(newProperty)
} catch (error) {
    res.status(400).json({ msg: error.message });
    // res.status(500).json({msg: "Something went wrong in NewProperty!!"})
    // console.log(error)
}})

// Edit Route - GET FOrm

// Update - PUT/PATCH
router.put('/:id', async (req, res) => {
  try {
    const updateProperty = await Property.findByIdAndUpdate(req.params.id, req.body)
    if (!updateProperty) {
        return res.status(404).json({ msg: 'Property not found' });
     }
    res.json(updateProperty)
} catch (error) {
    res.status(500).json({msg: "Something went wrong in updateProperty!!"})
    console.log(error)
}})


//Destroy route - DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleteProperty = await Property.findByIdAndDelete(req.params.id)
    if (!deleteProperty) {
        return res.status(404).json({ msg: 'Property not found' });
     }
    res.json(deleteProperty)
} catch (error) {
    res.status(500).json({msg: "Something went wrong in deleteProperty!!"})
    console.log(error)
}})


module.exports = router