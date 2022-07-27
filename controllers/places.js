const express = require('express'); 
const axios = require('axios');
require('dotenv').config();

const placesCategories = {
    historicalPlaces : 'entertainment.museum', // museums 
    historicBuildings : 'building.historic',
    publicPlaces : 'tourism.attraction',
    educationalPlaces : 'education.library', // libraries
    culture : 'entertainment.culture',
    shoppingMall : 'commercial.shopping_mall',
    healthAndBeauty : 'commercial.health_and_beauty',
    foodAndDrinks : 'commercial.food_and_drink',
    cafe : 'catering.cafe',
    restaurant : 'catering.restaurant',
    fastFood : 'catering.fast_food',
    bar : 'catering.bar',
    nightclub : 'adult.nightclub',
    zoo : 'entertainment.zoo',
    cinema : 'entertainment.cinema',
    themaPark : 'entertainment.theme_park',
    waterPark : 'entertainment.water_park',
    leisurePark : 'leisure.park',
    hospital : 'healthcare.hospital',
    healthcare : 'healthcare',
    embassyAndMinistry : 'building.office',
    resedntialBuilding : 'building.residential',
    publicAndCivilBuilding : 'building.public_and_civil',
    transportationBuilding : 'building.transportation',
    service : 'service',
    financialService : 'service.financial',
    travelAgency : 'service.travel_agency',
    taxi : 'service.taxi',
    publicTransport : 'public_transport',
    police : 'service.police',
    hotel : 'accommodation.hotel',
    sport : 'sport',
    swimmpingPoolAndSportCenter : 'sport.sports_centre',
    stadium : 'sport.stadium'

}   

getInformationsAboutPlaces =  (category, latitude, longitude) => {

    const latitude_1 = ((Number(latitude)) + 0.1 ).toString();
    const latitude_2 = ((Number(latitude)) - 0.1 ).toString();
    const longitude_1 = ((Number(longitude)) + 0.1).toString();
    const longitude_2 = ((Number(longitude)) - 0.1).toString();

    const informations = [] ;

    const searchCategory = placesCategories[category];
    return axios.get(`https://api.geoapify.com/v2/places?categories=${searchCategory}
        &filter=rect:${longitude_1},${latitude_1},${longitude_2},${latitude_2}&limit=40
        &apiKey=${process.env.GEOPIFY_API}`)
        .then (res => {
            for (var i = 0 ; i<res.data.features.length ; i++){
                let {name, street, county, city, state_district, country,  place_id}  = res.data.features[i].properties;     
                let {email, phone, website} = res.data.features[i].properties.datasource.raw; // here may be destructing from null error
                city = city || "";
                phone = phone || "";
                email = email || "";
                website = website || "";
                if (!website){
                    if (res.data.features[i].properties.datasource.raw.wikidata){
                        website = `https://www.wikidata.org/wiki/${res.data.features[i].properties.datasource.raw.wikidata}`
                    }
                    else if (res.data.features[i].properties.datasource.raw.osm_id){
                        switch(res.data.features[i].properties.datasource.raw.osm_type){
                            case 'w' :
                                website = `https://www.openstreetmap.org/way/${res.data.features[i].properties.datasource.raw.osm_id}`;
                                break;
                            case 'n' : 
                                website = `https://www.openstreetmap.org/node/${res.data.features[i].properties.datasource.raw.osm_id}`;
                                break; 
                            default : 
                                website = `https://www.openstreetmap.org/realtion/${res.data.features[i].properties.datasource.raw.osm_id}`;
                                    
                        }
                    }
                }

                const location = {
                    longitude : res.data.features[i].properties.lon,
                    latitude : res.data.features[i].properties.lat
                };
                const address = res.data.features[i].properties.formatted;
                const categories = [];
                res.data.features[i].properties.categories.forEach(element => {
                    const items = element.split(".");
                    categories.push(items[items.length-1]);
                });


                informations.push({
                    name,
                    country,
                    city,
                    state_district,
                    county,
                    street,
                    address,
                    location,
                    email,
                    phone,
                    website,
                    category,
                    categories,
//                    place_id
                });
            }
            return informations;
        })
}

module.exports.getInformationsAboutPlaces = (req, res, next) => {
    const {category, longitude, latitude} = req.query;
    if (!category || !longitude || !latitude){
        const error = new Error('missing informations');
        error.statusCode = 404;
        throw error;
    }
    getInformationsAboutPlaces(category, latitude, longitude)
        .then (informations => {
            res.status(200).json(informations);     
        })
        .catch (err => {
            next(err);
        })
}

// module.exports.getDetails = (place_id) => {
//     return axios.get(`https://api.geoapify.com/v2/place-details?id=${place_id}&apiKey=${process.env.GEOPIFY_API}`)
//              .then (res => {
//                 const {name, name_international, street, county,  state_district, country, city, housenumber, formatted, address_line1, address_line2, contact, website}  = res.data.features[0].properties;
//                 const location = {
//                     longitude : res.data.features[0].properties.lon,
//                     latitude : res.data.features[0].properties.lat
//                 };
//                 const categories = [];
//                 res.data.features[0].properties.categories.forEach(element => {
//                     const items = element.split(".");
//                     categories.push(items[items.length-1]);
//                 });


//                 const details = {
//                         name,
//                         name_international,
//                         country,
//                         city,
//                         contact,
//                         website,
//                         state_district,
//                         county,
//                         street,
//                         formatted,
//                         address_line1,
//                         address_line2,
//                         housenumber,
//                         location,
//                         categories
//                     };
            
//             return details;
//         })
// }