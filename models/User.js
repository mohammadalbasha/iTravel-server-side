const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
require('dotenv').config();
const Schema = mongoose.Schema;

//defining USER Schema in Database 
const UserSchema = new Schema({
    firstName : {
        type : String
    } ,
    lastName : {
        type : String
    },
    phoneNumber : {
        type : String,
        index : {
            unique : [true, "this phone number already exist"],
            partialFilterExpression : {googleId: {$type: "string"}}
          }
    },
    imageUrl : {
        type : String
    },
    username : {
        type : String,
        required : true,
        unique : [true, "this username already exist"],
    },
    role : {
        type : String,
        enum : ['Admin','User'],
        required : [true, 'role is required']
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
            'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : [true, 'password is required']
    },
    isConfirmed : {
        type : Boolean,
        default : false
    },
    isActive : {
        type : Boolean,
        default : true
    },
    nationality : {
        type : String
    }
});


// hashing password before saving in database
UserSchema.pre(
    'save',
    async function(next) {
      const user = this;
      const salt = parseInt(process.env.HASH_SALT);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    }
  );

module.exports = mongoose.model('User',UserSchema);