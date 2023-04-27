var express = require('express');
var router = express.Router();
const { ObjectId } = require("mongodb");
require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('ORDERS');
});

router.get('/all/:token', function(req, res, next) {
  let token = req.params.token

  if (token == process.env.ADMIN_KEY) {
    req.app.locals.db.collection('orders').find().toArray()
    .then(results => {
      res.status(200).json(results)
    })
  } else {
    res.status(401).json({message: "it's a no for me dawg"})
  }

  
});

router.post('/add', async function(req, res, next) {
  console.log(req.body)

  const { products } = req.body;

  for (const prod of products) {
    const test = await req.app.locals.db.collection('products').updateOne({ _id: new ObjectId(prod.productId) }, { $inc: {lager: -prod.quantity } }, { upsert: true })
    .then(result => {
      console.log(`${result.matchedCount} document matched the filter, updated ${result.modifiedCount} document(s)`);
    })
    
  };

  req.app.locals.db.collection('orders').insertOne(req.body)
  .then(result => {
    console.log("New order added")
    res.status(200).json(result)
  })


});

router.post('/user', function(req, res, next) {
  const userId = req.body;

  req.app.locals.db.collection("orders").find({user: userId.user}).toArray()
  .then(results => {
    if (results == null) {
      res.status(404).json("Can't find any orders")
    } else {
      res.status(200).json(results)

    }
  })
});


module.exports = router;
