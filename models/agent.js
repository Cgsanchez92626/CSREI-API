const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const agentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        if (v === "") return true; // Allow empty string
        // Check if the phone number matches any of the allowed formats
        return (
          /^\d{3}-\d{3}-\d{4}$/.test(v) || /^\d{1,3}-\d{3}-\d{3}-\d{4}$/.test(v)
        );
      },
      message: (props) =>
        `${props.value} is not a valid phone number format! Must be in the format "999-999-9999" or "9-999-999-9999"`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Add a custom validator for email format
    validate: {
      validator: function (v) {
        // Regex pattern to validate an email address
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"], // Password length validation
  },
});

// Add a method to compare passwords
agentSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

agentSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt
      const hashedPassword = await bcrypt.hash(this.password, salt); // Hash the password
      this.password = hashedPassword; // Replace the plain password with the hashed password
      next(); // Continue with the save operation
    } catch (err) {
      next(err); // Handle any errors that occurred during hashing
    }
  } else {
    next(); // Proceed if the password hasn't been modified
  }
});

// Set MongoDB native validation rules
agentSchema.set("validate", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstname", "lastname", "email", "password"],
      unique: ["email"],
      properties: {
        firstname: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        lastname: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        phone: {
          bsonType: "string",
          description:
            "Must be a string and can be an empty string or match the phone number format",
          pattern: "^\\d{3}-\\d{3}-\\d{4}$|^\\d{1,3}-\\d{3}-\\d{3}-\\d{4}$",
        },
        email: {
          bsonType: "string",
          description: "must be a string and is required",
          pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        },
        password: {
          bsonType: "string",
          description: "Must be a string and at least 6 characters long",
          minlength: 6,
        },
      },
    },
  },
  validationLevel: "moderate", // validation level (optional)
  validationAction: "error", // validation action (optional)
});
const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
