const mongoose = require('mongoose'); 
require ('dotenv').config();


const password = encodeURIComponent(process.env.DATABASE_PASSWORD);
const url = `mongodb+srv://${process.env.DATABASE_USERNAME}:${password}@cluster0.op0nt.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`; 
const options = { useNewUrlParser: true, useUnifiedTopology: true};

const connect = () => {
    return mongoose.connect(url,options) 
}

module.exports.connect = connect;
   
