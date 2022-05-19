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
    email : {
        type : String ,
        require : [true, 'email is required'],
        unique : [true, "this email already exist"],
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