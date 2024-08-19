require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
const conn = require("./DB/conn");

//Import Auth Data
const authRoutes = require("./routes/auth");
const protectedRoutes = require('./routes/protected'); // Example protected routes
const authMiddleware = require('./middleware/authMiddleware'); // Import your middleware

//Import Agent Data
const agentRoutes = require("./routes/agent");
const Agent = require("./models/agent");
const starterAgents = require("./DB/agentseed");

//Import Contact Data
const contactRoutes = require("./routes/contact");
const Contact = require("./models/contact");
const starterContacts = require("./DB/contactseed");

//Import Property Data
const propertyRoutes = require("./routes/property");
const Property = require("./models/property");
const starterProperties = require("./DB/propertyseed");

conn(); // Calling the connection function

app.use("/api/auth", authRoutes);
// Apply middleware to protected routes
app.use("/api/protected", authMiddleware, protectedRoutes);

app.use(express.json()); // to allow usage of req.body
app.use(cors()); //controls access to the API
app.use("/api/agents", agentRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/properties", propertyRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Home route!");
});

// Define a global variable to store the agentMap
let agentMap = {};
let contactMap = {};

// Seed Agents
app.get("/agent/seed", async (req, res) => {
  try {
    await Agent.deleteMany({}); // Delete all existing agents
    const agents = await Agent.create(starterAgents); // Create new agents

    // Create a map of email to _id
    agentMap = agents.reduce((map, agent) => {
      map[agent.email] = {
        agent_id: starterAgents.find((a) => a.email === agent.email)?.agent_id,
        _id: agent._id,
      };
      return map;
    }, {});

    console.log(`Inserted Agents: ${agents.length}`);
    res.json({ agents, agentMap }); // Return agent map for verification
  } catch (error) {
    console.log(
      `Something went wrong loading Agent seed data: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
});

// Seed Contacts
app.get("/contact/seed", async (req, res) => {
  try {
    await Contact.deleteMany({}); // Delete all existing contacts

    // Ensure agentMap is populated
    if (Object.keys(agentMap).length === 0) {
      return res.status(500).json({ error: "Agent map is not available." });
    }

    // Modify contacts with agent _id
    const contactsWithId = starterContacts.map((contact) => {
      const agentData = agentMap[contact.agent_email];
      if (!agentData) {
        console.warn(`No agent found for email ${contact.agent_email}`);
      }
      return {
        ...contact,
        agent: agentData ? agentData._id : null, // Replace agent_email with _id
      };
    });

    const contacts = await Contact.create(contactsWithId); // Create new contacts

    // Create a map of contact name to _id
    contactMap = contacts.reduce((map, contact) => {
      map[`${contact.firstname}_${contact.lastname}`] = contact._id;
      return map;
    }, {});

    console.log(`Inserted Contacts: ${contacts.length}`);
    res.json({ contacts, contactMap });
    
  } catch (error) {
    console.log(
      `Something went wrong loading Contact seed data: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
});

// Seed Properties
app.get("/property/seed", async (req, res) => {
  try {
    await Property.deleteMany({}); // Delete all existing properties

    // Ensure contactMap is populated
    if (Object.keys(contactMap).length === 0) {
      return res.status(500).json({ error: "Contact map is not available." });
    }

    // Modify properties with contact _id
    const propertiesWithId = starterProperties.map((property) => {
      const contactKey = `${property.contact_firstname}_${property.contact_lastname}`;
      const contactId = contactMap[contactKey];
      if (!contactId) {
        console.warn(`No contact found for ${contactKey}`);
      }
      return {
        ...property,
        contact: contactId || null, // Replace contact names with _id
      };
    });

    const properties = await Property.create(propertiesWithId); // Create new properties
    console.log(`Inserted Properties: ${properties.length}`);
    res.json(properties);
  } catch (error) {
    console.log(
      `Something went wrong loading Property seed data: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
});

// Update Contacts with Property References
app.get("/contact/update-properties", async (req, res) => {
    try {
      const properties = await Property.find({}).exec();
      
      // Create a map of contact _id to property _ids
      const contactPropertyMap = properties.reduce((map, property) => {
        if (property.contact) {
          if (!map[property.contact.toString()]) {
            map[property.contact.toString()] = [];
          }
          map[property.contact.toString()].push(property._id);
        }
        return map;
      }, {});
  
      // Update contacts with their properties
      await Promise.all(
        Object.keys(contactPropertyMap).map(async (contactId) => {
          await Contact.updateOne(
            { _id: contactId },
            { $set: { properties: contactPropertyMap[contactId] } }
          );
        })
      );
  
      console.log('Updated Contacts with properties.');
      res.json({ message: 'Contacts updated with properties successfully.' });
    } catch (error) {
      console.log(`Something went wrong updating contacts with properties: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });
  
// Error handling middleware - should be defined after all route handlers
app.use((err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    return res.status(400).json({ errors });
  }
  // Other types of errors
  return res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
