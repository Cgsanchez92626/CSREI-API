const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // Add a custom validator for email format
        validate: {
            validator: function(v) {
                // Regex pattern to validate an email address
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    }
});

// Set MongoDB native validation rules
agentSchema.set('validate', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required:  ["firstname", "lastname", "email"],
            properties: {
                firstname: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                lastname: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required",
                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                }
            }
        }
    },
    validationLevel: "moderate", // validation level (optional)
    validationAction: "error"    // validation action (optional)
});
const Agent = mongoose.model('Agent', agentSchema)

module.exports =  Agent;