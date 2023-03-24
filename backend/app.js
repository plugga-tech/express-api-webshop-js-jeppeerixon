var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var cors = require('cors');
require('dotenv').config();

var app = express();
var base = '/api';

//mongoDB connection
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DATABASE_URL, {
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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/', indexRouter);
app.use(base + '/users', usersRouter);
app.use(base + '/products', productsRouter);
app.use(base + '/orders', ordersRouter);
app.use(base + '/categories', categoriesRouter);

module.exports = app;
