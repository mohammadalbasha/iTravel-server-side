const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema({
    title : {
        type : String
    },
    type : {
        type : String,
        enum : ['Work', 'Master Study', 'Bachelor Study', 'Pleasure'],
        required : true
    },
    branch : {
        type : String
    },
    country : {
        type : String,
        required : true
    },
    city : {
        type : String
    },
    details : {
        type : String,
        required : true
    },

    creator : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    },
    interestedUsers : [{
        type : mongoose.Types.ObjectId,
        ref : 'User'
    }]    
});


module.exports = mongoose.model ('Experience', experienceSchema);






