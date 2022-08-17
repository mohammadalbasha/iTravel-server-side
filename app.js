//importing 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// my packages 
const db = require('./db');
const authRoutes = require('./routes/auth');
const countriesRoutes = require('./routes/countries');
const restaurantsRoutes = require('./routes/restaurants');
const staysRoutes = require('./routes/stays');
const placesRoutes = require('./routes/places');
const touristPlansRoutes = require('./routes/touristPlans');
const experiencesRoutes = require('./routes/experiences');
const tripsRoutes = require('./routes/trips');

const app = express();


// const fs = require('fs');


// require('./controllers/places')
// .getInformationsAboutPlaces('historicBuildings',33.535338949999996,36.32109262714975)
// .then ( res => {
//   console.log(res);
//       fs.writeFile('places.json', JSON.stringify(res) , (err) => {
//       console.log(err);

// })
// });

// near_me('51d255e7f2e12542405926af721608c04040f00102f9011e58210900000000920315d985d8b3d8aad8b4d981d98920d8afd985d8b4d982')
//   .then (res => {

//     });
//   });


// serving static images 
// needed only if we store images localy, but now we store images cloudly
app.use('/images', express.static(path.join(__dirname,'images')));

app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
//reading data from reauest as a JSON
app.use(bodyParser.json());


// solving the cors issue
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  

app.get('/' , (req,res,next) => {res.send("hello world")});

//routes 
app.use('/auth', authRoutes);
app.use('/countries', countriesRoutes);
app.use('/restaurants', restaurantsRoutes);
app.use('/stays', staysRoutes);
app.use('/places', placesRoutes);
app.use('/touristPlans', touristPlansRoutes);
app.use('/experiences', experiencesRoutes);
app.use('/trips', tripsRoutes);


// connecting to database and intialzing the server
db.connect()
.then (res => {
    console.log ('database connected successfully');
    return app.listen (process.env.PORT || 5000);
})
.then (res => {
    console.log('server is intialized');
})
.catch (err => {
    console.log(err);
});



// catching errors
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({status, message, data});
});
