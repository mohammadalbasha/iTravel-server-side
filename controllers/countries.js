const express = require ('express');
const axios = require('axios');


function extractInformations (informations){
    const name  = {
        common : informations.name.common,
        official : informations.name.official,
        nativeName : informations.name.nativeName[Object.keys(informations.name.nativeName)[0]].official
    }
    const currency = {
        code : Object.keys(informations.currencies)[0],
        name : informations.currencies[Object.keys(informations.currencies)[0]].name,
        symbol : informations.currencies[Object.keys(informations.currencies)[0]].symbol
    };
    const { idd, maps, population, car, startOfWeek, timezones, languages } = informations
    const flag = informations.flags.png;
    const capital = informations.capital[0];
    const location = {
        countryLocation : `https://www.google.com/maps/search/?api=1&query=${informations.latlng[0]},${informations.latlng[1]}`,
        capitalLocation : `https://www.google.com/maps/search/?api=1&query=${informations.capitalInfo.latlng[0]},${informations.capitalInfo.latlng[1]}`
    }
    return {
        name,
        currency,
        capital,
        languages,
        location,
        maps,
        timezones,
        flag,
        population,
        car,
        startOfWeek,
        idd
    }
}

function getGeneralInformations (category, value){
    return(
        axios({
            method: 'get',
            url: `https://restcountries.com/v3.1/${category}/${value}`
        })
        .then (respnose => {
            return extractInformations(respnose.data[0]);
        })
    );  
        
}

module.exports.getGeneralInformations = (req,res,next) => {
    const category = 'name';
    const value = req.params.value;

    getGeneralInformations(category,value)
        .then (informations => {
            res.status(200).json(informations);
        })
        .catch (err => {
            next(err);
        })
};
