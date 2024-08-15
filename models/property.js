const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    county: {
        type: String
    },
    parcelNumber: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === "") return true; // Allow empty string
                // Check if the parcel number matches the allowed format
                return /^\d{4}-\d{3}-\d{3}$/.test(v);
            },
            message: props => `${props.value} is not a valid parcel number format! Must be in the format "9999-999-999"`
        }
    },
    yearBuilt: {
        type: Number,
        validate: {
            validator: function(v) {
                // Check if v is not empty and is a number
                if (v === "") return true; // Allow empty string
                return /^\d{4}$/.test(v.toString()); // Check if it's a 4-digit number
            },
            message: props => `${props.value} is not a valid Year format! Must be a 4-digit number`
        }
    },
    propertyType: {
        type: String,
        enum: ['Single-Family', 'Multi-Family', 'Mix-Use'],
        required: true
    }
     
});

// Set MongoDB native validation rules
propertySchema.set('validate', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["address", "city", "state", "zipcode", "propertyType"],
            properties: {
                address: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                city: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                state: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                zipcode: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                county: {
                    bsonType: "string",
                    description: "must be a string if present"
                },
                parcelNumber: {
                    bsonType: "string",
                    description: "must be a string if present",
                    pattern: /^\d{4}-\d{3}-\d{3}$/
                },
                yearBuilt: {
                    bsonType: "int",
                    description: "must be an integer if present",
                    minimum: 1800, // Example minimum year
                    maximum: new Date().getFullYear() // Example maximum year (current year)
                },
                propertyType: {
                    bsonType: "string",
                    enum: ['Single-Family', 'Multi-Family', 'Mix-Use'],
                    description: "must be one of the enumerated values"
                }
            }
        }
    },
    validationLevel: "moderate", // validation level (optional)
    validationAction: "error"    // validation action (optional)
});

const Property = mongoose.model('Property', propertySchema)

module.exports =  Property;