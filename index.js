require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const conn = require('./DB/conn')

//Import Agent Data
const agentRoutes = require('./routes/agent')
const Agent = require('./models/agent')
const starterAgents = require('./DB/agentseed')

//Import Contact Data
const contactRoutes = require('./routes/contact')
const Contact = require('./models/contact')
const starterContacts = require('./DB/contactseed')

//Import Property Data
const propertyRoutes = require('./routes/property')
const Property = require('./models/property')
const starterProperties = require('./DB/propertyseed')

conn()   // Calling the connection function

// Middleware to use express react views
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(express.json())   // to allow usage of req.body
app.use('/api/agents',agentRoutes)
app.use('/api/contacts',contactRoutes)
app.use('/api/properties',propertyRoutes)

// Routes
app.get('/',(req, res)=> { 
    res.send('Home route!')
})

app.get('/agent/seed', async (req, res) => {
    try {
        await Agent.deleteMany({})             // Delete everthing
        await Agent.create(starterAgents)      // Load Seed Data
        res.json(starterAgents)
    } catch (error) {
        console.log(`Something went wrong loading Agent seed data ${error.message}`)
    }
})

app.get('/contact/seed', async (req, res) => {
    try {
        await Contact.deleteMany({})           // Delete everthing
        await Contact.create(starterContacts)  // Load Seed Data
        res.json(starterContacts)
    } catch (error) {
        console.log(`Something went wrong loading Contact seed data ${error.message}`)
    }
})

app.get('/property/seed', async (req, res) => {
    try {
        await Property.deleteMany({})             // Delete everthing
        await Property.create(starterProperties)  // Load Seed Data
        res.json(starterProperties)
    } catch (error) {
        console.log(`Something went wrong loading Property seed data ${error.message}`)
    }
})

// Error handling middleware - should be defined after all route handlers
app.use((err, req, res, next) => {
        // Mongoose validation error
        if (err.name === 'ValidationError') {
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
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
});