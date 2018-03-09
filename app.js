'use strict';
const express = require('express');
const db = require('./db');
const app = express();
const morgan = require('morgan'); // helps with async rquest
const nunjucks = require('nunjucks'); // helps with html template parsing
// const makesRouter = require('./routes');
const fs = require('fs'); // helps read the file system
const path = require('path'); //
const bodyParser = require('body-parser');
const socketio = require('socket.io');


// templating boilerplate setup
app.engine('html', nunjucks.render); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
nunjucks.configure('views', { noCache: true }); // where to find the views, caching off

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests


// start the server
const server = app.listen(3000, function(){
  console.log('listening on port 3000');
});

app.use(express.static(path.join(__dirname, '/public')));

