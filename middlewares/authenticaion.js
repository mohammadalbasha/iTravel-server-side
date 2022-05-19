const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.isLoggedIn = (req,res,next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader){
        const error = new Error ('Not Authenticated! please login');
        error.statusCode = 401;
        throw error;
    }
    // extracting JWT from Authorization header as bearer token 
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    }
    catch (err) {
        error.statusCode = 500;
        throw err;
    }
    if (!decodedToken){
        const error = new Error('Not authenticated! please login');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;

    User.findById(req.userId)
        .then (user => {
            if (user.isConfirmed === 'false'){
                const error = new Error('please confirm your account!');
                error.statusCode = 401;
                throw error;
            }
            if (user.isActive === 'false'){
                const error = new Error('sorry, You Are Blocked!');
                error.statusCode = 401;
                throw error;
            }
            next();
        })
        .catch (err => {
            next(err);
        })
}

module.exports.isAdmin = (req,res,next) => {
    User.findById (req.userId)
        .then (user => {
            if (user.role !=='Admin'){
                const error = new Error('Not Authorized! ,Admins only can access that.');
                error.statusCode = 401;
                throw error;          
            }
            next();
        })
        .catch (err => {
            next(err);    
        })

}