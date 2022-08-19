const express = require('express');
const { ObjectId } = require('mongodb');

const Trip = require('../../models/Trip');


function extractTripInformationsFromRequest (req) {
    const images = [];
    for (var i=0 ; i<req.files.length ; i++){
        images.push(req.files[i].path);
    }
    const {tripName, duration, capacity, transportations, country, launchCity, destinationCity, launchPlace, destinationPlace, stations, features, description, currency, cost, phoneNumber, email, launchDate, returnDate } = req.body;
    const generalInformations = {
        tripName,
        duration,
        capacity,
        transportations,
        launchDate,
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
        features,
        contact,
        owner,
        images,
        description,
        price
    };
}

module.exports.addTrip = (req, res, next) => {
    const trip = new Trip (extractTripInformationsFromRequest(req));
    trip.save()
        .then (result => {
            res.status(200).json("trip added successfully");
        })
        .catch (err => {
            next(err);
        })

};

 
function applyRegex (query, key, property){
    if (property == 'undefined' || property == 'default')return;
    property = property ? {$regex:property.toString()} : property;
    if (property){
        query[key] = property;
    }
     
}
module.exports.getTrips = (req, res, next) => {
    let {country, launchCity, destinationCity, searchFilter} = req.query;
    const query = {
    }; 
    if (country && country != 'undefined' && country != 'default') {
        query['location.country'] = country;
    }
    if (launchCity && launchCity != 'undefined' && launchCity != 'default'){
        query['location.launchCity'] = launchCity;
    }
    if (destinationCity && destinationCity != 'undefined' && destinationCity != 'default'){
        query['location.destinationCity'] = destinationCity;
    }
   
    const query1 = {...query};
    const query2 = {...query};
    
    console.log(query1, query2)
    applyRegex(query1, 'description', searchFilter);
    applyRegex(query2, 'generalInformations.tripName', searchFilter);
    

    
    Trip.find({
        $or : [query1, query2]
    })
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
    const {userId} = req;

    Trip.findById(tripId)
        .then (trip => {
            trip.interestedUsers.push(userId)
            return trip.save();
        })
        .then (result => {
            console.log(result)
            res.status(200).json("this user was marked interested successfully");
        })
        .catch (err => {
            next(err);
        })
}