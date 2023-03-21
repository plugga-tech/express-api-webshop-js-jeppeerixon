var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');


var app = express();
var base = '/api';

//mongoDB connection
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017', {
    useUnifiedTopology: true
}).then(client => {
    console.log('MongoDB connected!')
    const db = client.db('jesper-eriksson')
    app.locals.db = db
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(base + '/users', usersRouter);
app.use(base + '/products', productsRouter);
app.use(base + '/orders', ordersRouter);

module.exports = app;
