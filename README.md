# CSREI-API

The API is deployed via rendor.com and is live at: https://csrei-api.onrender.com
This deliverable is for the Capstone Project MongoDB Database Application assignment Back-end portion of the MERN complete project
This uses Node.js , Express, and MongoDB
It uses Mongoose for talking with MongoDB
Uses JasonWebToken for authentication which provides a token that expires in 1hr
Uses cors Cross-Origin Resource Sharing for ensuring request are only allowed to come from the specific origin. It allows your backend to specify who can access its resources.
Auth routes are provived for authentication and refreshing the token, set in the frontend to occur every 5 minutes.
uses bcryptjs - to encrypt password in the DB for security reasons.

Use of dotenv - to use variables to define protected data/credential
It defines the models for 3 data collections, several validation rules have been defined at the application and at the DB layer to ensure the quality of the data entered.
Uses seed data to load the 3 collections and establish referential integrity across the 3 collections

1. /agent/seed - Loads the data into the agentSchema and builds agentMap to use in the next step also encrypts password
2. /contact/seed - Loads the contactSchema uses the AgentMap to load values for referential integrity to agentSchema and creates contactMap for the next step
3. /property/seed - loads propertySchema and uses the contactMap to load values for referential integrity to contactSchema
4. /contact/update-properties - Creates a map of contact \_ids to arrays of property \_ids, and updates each contact document to include this array of property references.

From the front end:
The Agent Routes are used in authentication from the Login component
The Contact and Property Routes are used manage the same via the CRM Component,
currently only Contact has full CRUD implemented.
You can add contact - adds a contact for the agent that is signed in
Edit a contact - Edits the contact
Delete Contact - Starts a Mongoose session to manage the transaction, as there is referential integrity between contact and property and protery and contact. The delete transactions will place any properties associated with the deleted contact into the "Admin" Contact reference and will also update the property.contact reference, all toprevent the property records from being orphaned and not wanting to delete them.  
Yo can also Add a Property from the frontend. All other routes for property though coded can only be accessed via browser ot tool like Postman.
