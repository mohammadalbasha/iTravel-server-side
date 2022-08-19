const express = require('express');
const { ObjectId } = require('mongodb');
    const Experience = require('../../models/Experiences');

    function extractPlaceInformationsFromRequest(req){
        const {title, country, city, type, branch, details} = req.body
        const creator = new ObjectId(req.userId);
        return {
            title,
            type,
            branch,
            country,
            city,
            details,
            creator
        }
    }
    module.exports.addExperience = (req, res, next) => {
        const experience = new Experience(extractPlaceInformationsFromRequest(req));
        return experience.save()
                        .then (result => {
                            res.status(200).json('Experience added successfully');
                        })
                        .catch (err => {
                            next(err);
                        })
    } 
    
    function applyRegex (query, key, property){
        if (property == 'undefined' || property == 'default')return;
        property = property ? {$regex:property.toString()} : property;
        if (property){
            query[key] = property;
        }
         
    }
    module.exports.getExperiences = (req, res, next) => {
        
        let {country, city, type, branch, searchFilter, creatorNationality} = req.query;
        const query = {}; 
        if (country && country != 'undefined') {
            query.country = country;
        }
        if (city && city != 'undefined'){
            query.city = city;
        }
        if (branch && branch != 'undefined' && branch != 'default'){
            query.branch = branch;
        }
        if (type && type != 'undefined' && branch != 'default'){
            query.type = type;
        }
        const query1 = {...query};
        const query2 = {...query};
        detailsFilter = applyRegex(query1, 'details', searchFilter);
        detailsFilter = applyRegex(query2, 'title', searchFilter);
        

        Experience.find({
            $or : [query1, query2]
        })
        .populate('creator')
           .then (experiences => {
            if (creatorNationality && creatorNationality != 'undefined' && creatorNationality != 'default'){
                const filteredExperiences = experiences.filter(experience =>  experience.creator.nationality === creatorNationality);
                res.status(200).json(filteredExperiences);
            }
            else{
                res.status(200).json(experiences)
        
            }
           
        })
           .catch(err => {
            next(err);
           })
       

    }
