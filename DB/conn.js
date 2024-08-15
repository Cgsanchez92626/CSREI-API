const mongoose = require('mongoose')

const conn = () => {
    try {
         mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongoose.connection.once("open", ()=>{
            console.log("Connected to Mongo DB")
        })
    } catch (error) {
        console.error(`Somethimg went wrong with connect to the database ${error.message}`)
    }
}

module.exports = conn


