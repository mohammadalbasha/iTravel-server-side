const express = require('express');
const { ObjectId } = require('mongodb');

const Trip = require('../../models/Trip');


function extractStayInformationsFromRequest (req) {
    const images = [];
    for (var i=0 ; i<req.files.length ; i++){
        images.push(req.files[i].path);
    }
    const {tripName, duration, capacity, transportations, country, launchCity, destinationCity, launchPlace, destinationPlace, stations, features, description, currency, cost, phoneNumber, email, startDate, returnDate } = req.body;
    const generalInformations = {
        tripName,
        duration,
        capacity,
        transportations,
        startDate,
        returnDate
    };
    const location = {
        country,
        destinationCity,
        launchCity,
        launchPlace,
        destinationPlace,
        stations
    };
    const feaature = [...features];
    const price = {
        currency,
        cost
    };
    const contact = {
        phoneNumber,
        email
    };
    const owner = new ObjectId(req.userId);

    return {
        generalInformations,
        location,
        feaature,
        contact,
        owner,
        images,
        description,
        price
    };
}

module.exports.addTrip = (req, res, next) => {
    const stay = new Trip (extractStayInformationsFromRequest(req));
    trip.save()
        .then (result => {
            res.status(200).json("trip added successfully");
        })
        .catch (err => {
            next(err);
        })

};

module.exports.getTrips = (req, res, next) => {
    Trip.find()
        .select('-owner -interestedUsers')
        .then (trips => {
            res.status(200).json(trips);
        })
        .catch (err => {
            next(err);
        })
}

module.exports.getTrip = (req, res, next) => {
    const {tripId} = req.params;
    Trip.findById(tripId)
        .populate ('owner interestedUsers')
        .then (trip => {
            res.status(200).json(trip);
        })
        .catch (err => {
            console.log(err);
        })
};

module.exports.addInterestedUser = (req, res, next) => {
    const {tripId} = req.params;
    const {userId} = req.body;

    Trip.findById(tripId)
        .then (trip => {
            trip.interestedUsers.push(userId)
            return trip.save();
        })
        .then (result => {
            res.status(200).json("this user was marked interested successfully");
        })
        .catch (err => {
            next(err);
        })
}