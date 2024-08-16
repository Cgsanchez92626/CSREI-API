require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const conn = require("./DB/conn");

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

// Middleware to use express react views
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jsx');
// app.engine('jsx', require('express-react-views').createEngine());

app.use(express.json()); // to allow usage of req.body
app.use("/api/agents", agentRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/properties", propertyRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Home route!");
});


// Define a global variable to store the agentMap
let agentMap = {};

// Seed Agents
app.get("/agent/seed", async (req, res) => {
  try {
    await Agent.deleteMany({}); // Delete all existing agents
    const agents = await Agent.create(starterAgents); // Create new agents

    // Create a map of email to _id
    agentMap = agents.reduce((map, agent) => {
      map[agent.email] = { agent_id: starterAgents.find(a => a.email === agent.email)?.agent_id, _id: agent._id };
      return map;
    }, {});

    console.log(`Inserted Agents: ${agents.length}`);
    res.json({ agents, agentMap }); // Return agent map for verification
  } catch (error) {
    console.log(`Something went wrong loading Agent seed data: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});


// Seed Contacts
app.get("/contact/seed", async (req, res) => {
    try {
      await Contact.deleteMany({}); // Delete all existing contacts
  
      // Ensure agentMap is populated
      if (Object.keys(agentMap).length === 0) {
        return res.status(500).json({ error: 'Agent map is not available.' });
      }
  
      // Modify contacts with agent _id
      const contactsWithId = starterContacts.map(contact => {
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
      console.log(`Inserted Contacts: ${contacts.length}`);
      res.json(contacts);
    } catch (error) {
      console.log(`Something went wrong loading Contact seed data: ${error.message}`);
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
