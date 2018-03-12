'use strict';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

const models = require('./models');
const router = require('./routes');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const env = nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/', router);
app.use(express.static(path.join(__dirname, '/public')));

// make sure you are exporting your db from your models file
models.db.sync()
.then(function () {
    console.log('All tables created!');
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error.bind(console));
