const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    
    generalInformations : {
        tripName : {
            type : String,
        },
        duration : {
            type : String,
        },
        capacity : {
            type : Number
        },
        transportaions : {
            type : String,
            enum : ['bus', 'train', 'microbus', 'ship', 'boat', 'multiple']
        },
        launchDate : {
            type : Date
        },
        returnDate : {
            type : Date
        }
    },
    location : {
        country : {
            type : String,
            required : true
        },
        launchCity : {
            type : String,
            required : true 
        },
        destinationCity : {
            type : String,
            required : true
        },
        launchPlace : {
            type : String,
            required : true 
        },
        destinationPlace : {
            type : String,
            required : true
        },
        stations : [{
            type : String
        }]
    },
    features : {
        type : [String]
    },
    description : {
        type : String
    },
    images : {
        type : [String]
    },
    price : {
        currency : {
            type : String
        },
        cost : {
            type : String
        }
    },
    contact : {
        phoneNumber : {
            type : String
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: [true, 'this email alreadu exists'],
            required: 'Email address is required',
            validate: [(email) => {
                    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return re.test(email)
                }, 
                'Please fill a valid email address']
        }
    },
    owner : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    },
    interestedUsers : [{
        type : mongoose.Types.ObjectId,
        ref : 'User'
    }]    
});


module.exports = mongoose.model ('Trip', tripSchema);






