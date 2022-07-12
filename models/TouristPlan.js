const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    name : {
        type : String
    },
    country : {
        type : String
    },
    city : {
        type : String
    },
    state_district : {
        type : String
    },
    street : {
        type : String
    },
    address : {
        type : String
    },
    location : {
        longitude : {
            type : String
        },
        latitude : {
            type : String
        }
    },
    category : {
        type : String
    },
    categories : {
        type : [String]
    },
    userDescription : {
        type : String
    },
    userImages : {
        type : [String]
    }
});

const planSchema = mongoose.Schema({
    title : {
        type : String
    },
    country : {
        type : String,
        required : true 
    },
    city : {
        type : String
    },
    userDescription : {
        type : String
    },
    places : {
        type : [placeSchema]
    },
    planCreator : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    interestedUsers : [{
        type : mongoose.Types.ObjectId,
        ref : 'User'
    }]
});

module.exports = mongoose.model('TouristPlan', planSchema);