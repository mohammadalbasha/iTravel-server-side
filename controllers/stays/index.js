const express = require('express');
const { ObjectId } = require('mongodb');

const Stay = require('../../models/Stay');


function extractStayInformationsFromRequest (req) {
    const images = [];
    for (var i=0 ; i<req.files.length ; i++){
        images.push(req.files[i].path);
    }
    const {propertyName, propertyType, rooms, floor, country, city, area, address, facingDirection,  feature1, feature2, feature3, feature4, feature5, feature6, description, currency, rentalPrice, contactRenewal, phoneNumber, email } = req.body;
    const property = {
        propertyName,
        propertyType,
        rooms,
        floor
    };
    const location = {
        country,
        city,
        area,
        address,
        facingDirection
    };
    const feaature = [feature1, feature2, feature3, feature4, feature5, feature6];
    const price = {
        currency,
        rentalPrice
    };
    const contact = {
        phoneNumber,
        email
    };
    const owner = new ObjectId(req.userId);

    return {
        property,
        location,
        feaature,
        images,
        description,
        contactRenewal,
        price,
        owner,
        contact
    };
}

module.exports.addStay = (req, res, next) => {
    const stay = new Stay (extractStayInformationsFromRequest(req));
    stay.save()
        .then (result => {
            res.status(200).json("stay added successfully");
        })
        .catch (err => {
            next(err);
        })

};

module.exports.getStays = (req, res, next) => {
    Stay.find()
        .select('-owner -interestedUsers')
        .then (stays => {
            res.status(200).json(stays);
        })
        .catch (err => {
            next(err);
        })
}

module.exports.getStay = (req, res, next) => {
    const {stayId} = req.params;
    Stay.findById(stayId)
        .populate ('owner interestedUsers')
        .then (stay => {
            res.status(200).json(stay);
        })
        .catch (err => {
            console.log(err);
        })
};

module.exports.addInterestedUser = (req, res, next) => {
    const {stayId} = req.params;
    //const {userId} = req.body;
    const { userId } = req;
    
    Stay.findById(stayId)
        .then (stay => {
            stay.interestedUsers.push(userId)
            return stay.save();
        })
        .then (result => {
            res.status(200).json("this user was marked interested successfully");
        })
        .catch (err => {
            next(err);
        })
}