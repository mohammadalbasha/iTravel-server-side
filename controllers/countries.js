const express = require ('express');
const axios = require('axios');

function getGeneralInformations (category, value){
    return(
        axios({
            method: 'get',
            url: `https://restcountries.com/v3.1/${category}/${value}`
        })
        .then (respnose => {
            console.log(respnose.data[0].name.official);
            return respnose.data;
        })
    );  
        
}


module.exports.getGeneralInformations = (req,res,next) => {
    const category = req.params.category;
    const value = req.params.value;

    
    getGeneralInformations(category,value)
    .then (informations => {
        res.status(200).json(informations);
    })
    .catch (err => {
        next(err);
    })
};
