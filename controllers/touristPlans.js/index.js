const express = require('express');

const TouristPlan = require('../../models/TouristPlan');

module.exports.createPlan = (req, res, next) => {
    const {title, country, city, userDescription} = req.body;
    const planCreator = req.userId;

    const tourist_plan = new TouristPlan({
        title,
        country,
        city,
        userDescription,
        places : [],
        planCreator,
        interestedUsers : [] 
    });

    return tourist_plan.save()
                        .then (plan => {
                            res.status(200).json("plan added successfully");
                        })
                        .catch (err => {
                            next(err);
                        })
}

function extractPlaceInformationsFromRequest (req) {
    const images = [];
    for (var i=0 ; i<req.files.length ; i++){
        images.push(req.files[i].path);
    }
    const {name, country, city, state_district, street, address, location, category, categories, userDescription} = req.body;
    return {
        name,
        country,
        city,
        street,
        state_district,
        address,
        location,
        category,
        categories,
        userDescription,
        userImages : images
    };
}

module.exports.addPlaceToPlan = (req, res, next) => {
    const planId = req.params.planId;
    const creatorId = req.userId;

    TouristPlan.findById(planId)
                .then (plan => {
                    if (!plan){
                        const error = new Error('plan not found');
                        error.statusCode = 404;
                        throw error;
                    }
                    if (plan.planCreator != creatorId){
                        const error = newError ('Authorization Error, you can not edit this plan');
                        error.statusCode = 401;
                        throw error;
                    }

                    plan.places.push(extractPlaceInformationsFromRequest(req));
                    return plan.save();
                })
                .then (editedPlan => {
                    res.status(200).json("place added successfully");
                })   
                .catch(err => {
                    next(err);
                });
}

module.exports.getMyPlans = (req, res, next) => {
    TouristPlan.find({planCreator: req.userId})
                .select('-planCreator -interestedUsers')
                .then (plans => {
                    res.status(200).json(plans);
                })
                .catch (err => {
                    next(err);
                })
}

module.exports.getMyPlansGeneral = (req, res, next) => {
    TouristPlan.find({planCreator: req.userId})
                .select('_id title country city')
                .then (plans => {
                    res.status(200).json(plans);
                })
                .catch (err => {
                    next(err);
                })
}

function applyRegex (query, key, property){
    if (property == 'undefined' )return;
    property = property ? {$regex:property.toString()} : property;
    if (property){
        query[key] = property;
    }
     
}
module.exports.getPlans = (req, res, next) => {
    let {country, city, searchFilter} = req.query;
    const query = {
    }; 
    if (country && country != 'undefined') {
        query['country'] = country;
    }
    if (city && city != 'undefined'){
        query['city'] = city;
    }
    const query1 = {...query};
    const query2 = {...query};
    
    console.log(query1, query2)
    applyRegex(query1, 'title', searchFilter);
    applyRegex(query2, 'description', searchFilter);
    


            TouristPlan.find({
                $or : [query1, query2]
            })
                .select('-places -interestedUsers -planCreator')
                .then (plans => {
                    res.status(200).json(plans);
                })
                .catch(err => {
                    next(err);
                })
}

module.exports.getPlan = (req, res, next) => {
    const planId = req.params.planId;
    TouristPlan.findById(planId)    
                .populate('planCreator')
                .populate('interestedUsers')
                .then (plan => {
                    res.status(200).json(plan);
                })
                .catch(err => {
                    next(err);
                })
}

module.exports.addInterestedUser = (req, res, next) => {
    const planId = req.params.planId;
    const userId = req.userId;
    TouristPlan.findById(planId)
                .then (plan => {
                    plan.interestedUsers.push(userId);
                    return plan.save();
                })
                .then (editedPlan => {
                    res.status(200).json("interested user added successfully");
                })
                .catch(err => {
                    next(err);
                })
}