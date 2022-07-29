const mongoose = require('mongoose');

// defining STAY SCHEMA in Database
const staySchema = mongoose.Schema({
    
    property : {
        propertyName : {
            type : String,
        },
        propertyType : {
            type : String,
            enum : ['apartment', 'sweet', 'house']
        },
        rooms : {
            type : String
        },
        floor : {
            type : String
        }
    },
    location : {
        country : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true 
        },
        area : {
            type : String,
            required : true
        },
        address : {
            type : String,
            required : true
        },
        facingDirection : {
            type : String
        }
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
        rentalPrice : {
            type : String
        }
    },
    contactRenewal : {
        type : String
    },
    contact : {
        phoneNumber : {
            type : String
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
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


module.exports = mongoose.model ('Stay', staySchema);






