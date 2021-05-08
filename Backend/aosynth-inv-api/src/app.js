// This app will utilize express, body parser, method override, the router file from the routers folder to route requests,
// CORS to allow the application to communicate with the MySQL Database, and dotenv to setup the login tokens (which was not
// utilized by the application fully)
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
//route for the application
const router = require('./routers/router.js');
const cors = require('cors');
dotenv = require('dotenv');
dotenv.config();

// Test and see whether CORS could be coded in or a package would be required
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

//utilize the public directory for images and css files
// app.use(express.static('public'));

// define ejs files that might have been used (might not be necessary cause using react)
// app.set('view engine', 'ejs');

// Allow the application to parse through JSON objects
app.use(bodyParser.json());

// Will only parse JSON objects that are encoded within URLs and will only match requests where Content Header Type matches
// the type option, as explained here: https://stackoverflow.com/questions/55558402/what-is-the-meaning-of-bodyparser-urlencoded-extended-true-and-bodypar
app.use(bodyParser.urlencoded({extended: true}));

// Override form methods for easier ability to update and delete
app.use(methodOverride('_method'));

// Utilize the CORS library to allow the application to communicate with the Database
app.use(cors());

// Utilize express for the backend part of the application (which is not used, as it is mainly for outputting a look)
app.use(express.json());

// Utilize the router file to successfully route requests from the front end through the backend to perform the appropriate CRUD functions
app.use(router);

//states what port for the server to listen to for incoming request
const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    //catch errors
    if(err) throw err;
    else console.log("http://localhost:3000");
});