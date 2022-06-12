const axios = require("axios");
require('dotenv').config; // this package to access environmental variables

function getLocationID (city, country){
    // this function return a location ID for specific city 
    // location ID required for the restaurants API
  
    city = city.toLowerCase();
    city= city.charAt(0).toUpperCase() + city.slice(1);
    const encodedParams = new URLSearchParams();
    encodedParams.append("language", "en_US");
    encodedParams.append("q", city);

    const options = {
      method: 'POST',
      url: 'https://worldwide-restaurants.p.rapidapi.com/typeahead',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Host': process.env.RAPID_API_HOST,
        'X-RapidAPI-Key': process.env.RAPID_API_KEY
      },
      data: encodedParams
    };

    return axios.request(options)
                  .then(function (response) {
                      const {results} = response.data;
                      const {data} = results;
                      let cityIndex = -1;
                      // the result conatin multiple cities around the world , we need to make sure that the city belongs to the country 
                      // ex : there is damascus in syria and damascus in another country , we need to take damascus in syria
                      for (let i=0 ; i<data.length ; i++ ){
                          const {result_object} = data[i];
                          const {ancestors} = result_object;
                          for (let j=0 ; j<ancestors.length ; j++){
                              if (ancestors[j].name.toUpperCase() == country.toUpperCase() && ancestors[j].subcategory[0].key == "country"){
                                    cityIndex = i;
                                    break;
                                  }
                          }
                          if (cityIndex != -1)
                            break;      
                      }
                      if (cityIndex == -1){
                        const error = new Error('city or country are invalid');
                        error.statusCode = 404;
                        throw(error);
                      }
                      return data[cityIndex].result_object.location_id;    
                })
                  // .catch(function (error) {
                  //   console.error(error);
                  // });
}

function getRestaurants (city, country){
    return getLocationID(city, country)
            .then (locationId => {
              const encodedParams = new URLSearchParams();
              encodedParams.append("currency", "USD");
              encodedParams.append("location_id", locationId);
              encodedParams.append("limit", "30");
              encodedParams.append("language", "en_US");

              const options = {
                method: 'POST',
                url: 'https://worldwide-restaurants.p.rapidapi.com/search',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'X-RapidAPI-Host': process.env.RAPID_API_HOST,
                  'X-RapidAPI-Key': process.env.RAPID_API_KEY
                },
                data: encodedParams
              };

              return axios.request(options)
                  .then(function (response) {  
                      let restaurants = [];
                      const {results} = response.data;
                      const {data} = results;
                      for (let i=0 ; i<data.length ; i++){
                        const {name, latitude, longitude, awards, ranking, rating, is_closed, open_now_text, price_level, decription, website, email, phone, address, address_obj, hours, nearest_metro_station } = data[i];
                        const location = data[i].location_string;
                        const tripadvisor_url = data[i].web_url;
                        const images = data[i].photo ?  {...data[i].photo.images} : null;
                        let cuisine = [];
                        data[i].cuisine.forEach(element => {
                          cuisine.push(element.name);
                        });
                        let dietary_restrictions = [];
                        data[i].dietary_restrictions.forEach(element => {
                          dietary_restrictions.push(element.name);
                        });

                        restaurants.push({
                          name, latitude, longitude, location, awards, ranking, rating, is_closed, open_now_text, price_level, decription, website, email, tripadvisor_url, phone, address, address_obj, images, cuisine, dietary_restrictions
                        })
                    }
                    return restaurants;
              })
                //   .catch(function (error) {
                //     next(err);
                // });
          })
      //   .catch (err => {
      //     next(err);
      // });
    
}

module.exports.getRestaurants = (req,res,next) => {
  const city = req.body.city;
  const country = req.body.country;
  getRestaurants(city, country)
      .then (restaurants => {
        res.status(200).json(restaurants);
      })
      .catch(err => {
        console.log(err)
        next(err);
      })
}