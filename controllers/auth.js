//3rd party packages
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//my packages
const User = require('../models/User');
const {confirmAccount} = require('../shared/sendingEmails');

// extracting user information from req.body
function extractUserInformation (req){

    const firstName = req.body.firstName ? req.body.firstName : null;
    const lastName = req.body.lastName ? req.body.lastName : null;
    const phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : null;
    const nationality = req.body.nationality ? req.body.nationality : null;
 
    const {username, password, email} = req.body;
    //imageUrl=req.file.path.replace("\\" ,"/");
    imageUrl = req.file.path;
    
    let role ;
    if (req.url==='/admin/signup')
        role = 'Admin';
    else if (req.url==='/signup')
        role = 'User';
    
    return {
        firstName,
        lastName,
        phoneNumber,
        username,
        password,
        email,
        role,
        nationality,
        imageUrl
    }       
}

module.exports.signUp = (req,res,next) => {
  
    const user = new User(extractUserInformation(req));
    user.save() 
        .then (userDoc => {
            // confirmAccount(userDoc._id, userDoc.email)
            // .then (result => {
            //     res.status(201).json('Succesfully Signed Up! please Confirm Your Account, we have send a massage to your email.')
            // })
            // .catch (err => {
            //     User.findByIdAndDelete(userDoc._id.toString())
            //     .then (response => {
            //         next(err);
            //     })
            //     .catch (err => {
            //         next(err);
            //     })
            // })
            res.status(201).json('Succesfully Signed Up! please Confirm Your Account, we have send a massage to your email.')

        })
        .catch (err => {
            next(err);
        })
}

module.exports.confirmAccount = (req,res,next) => {
    const userId = req.params.userId;
    User.findByIdAndUpdate(userId, {isConfirmed:true})
        .then (user => {
                res.status(200).send('<h4> Confirmtion done successfully!, go back to our app and login');
        })
        .catch (err => {
            next(err);
        })

}

module.exports.login = (req,res,next) => {

    const username = req.body.username;
    const password = req.body.password;
   
    let loadedUser; 

    User.findOne( {  $or: [{'email':username}, {'username':username}]})
        .then (user => {
            if (!user){
            const error = new Error('A user with this email or username could not be found.');
            error.statusCode = 401;
            throw error;
            }
            if (!user.isConfirmed){
                const error = new Error('please confirm you account');
                error.statusCode = 401;
                throw error;
            }
            if (!user.isActive){
            const error = new Error('sorry, You Are Blocked');
            error.statusCode = 401;
            throw error;
            }
            if (user.role==='Admin'&&req.url==='/login'||user.role==='User'&&req.url==='/admin/login'){
                const error = new Error('User cannot be found');
                error.statusCode = 401;
                throw error;
            }
            loadedUser=user;
            return bcrypt.compare(password,user.password);
            })
            .then (isEqual => {
                if (!isEqual){
                    const error = new Error('Wrong Password.');
                    error.statusCode = 401;
                    throw error;   
                }

                const token =jwt.sign({
                        username,
                        userId : loadedUser._id
                    },
                    process.env.JWT_SECRET_KEY,
                    {expiresIn:'1h'}
                );
                res.status(200).json({ token: token, user: loadedUser });

            })
             .catch (err => {
                next(err);
        })

};

module.exports.getProfile = (req, res, next) => {
    console.log(req.user);
    res.status(200).json(req.user);
}