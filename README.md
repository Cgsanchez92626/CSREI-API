# CSREI-API

This deliverable is for the Capstone Project MongoDB Database Application assignment Back-end portion of the MERN complete project
This uses  Node.js , Express, and MongoDB
It uses Mongoose for talking with MongoDB
It defines the models for 3 data collections, several validation rules have been defined at the application and at the DB layer to ensure the quality of the data entered.
Uses seed data to load the 3 collections and establish referential integrity across the 3 collections

1. /agent/seed - Loads the data into the agentSchema and builds agentMap to use in the next step also encrypts password
2. /contact/seed - Loads the contactSchema uses the AgentMap to load values for referential integrity to agentSchema and creates contactMap for the next step
3. /property/seed - loads propertySchema and uses the contactMap to load values for referential integrity to contactSchema
4. /contact/update-properties - Creates a map of contact \_ids to arrays of property \_ids, and updates each contact document to include this array of property references.

All CRUD routes have been created and tested via Postman: https://sba-318-reic-api-team.postman.co/workspace/SBA-318-REIC-API-Team-Workspace~2a7cd160-f7e4-432d-8903-d297c3b20fa3/request/36935542-59b6e831-1320-4fe7-85ba-e193ac5f3329?action=share&creator=36935542&ctx=documentation - you can use all these paths for testing, leave the old ID's to test the error handling and just change any ID values that you are working with to test successful DB conditions.# CSREI-API
Endpoints and descriptions: