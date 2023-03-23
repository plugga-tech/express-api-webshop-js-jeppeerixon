var express = require('express');
var router = express.Router();
const { ObjectId } = require("mongodb");

/* GET users listing. */
router.get('/', function(req, res, next) {  
  req.app.locals.db.collection('products').find().toArray()
  .then(results => {
    res.status(200).json(results)
  })
});

router.post('/add', function(req, res, next) {

  req.app.locals.db.collection('products').insertOne(req.body)
  .then(result => {
    console.log("New product added" + result)
    res.status(200).json(result)
  })
});

router.get('/:productId', function(req, res, next) {
  productId = req.params.productId;
  console.log(productId);

  req.app.locals.db.collection("products").findOne({"_id": new ObjectId(productId)})
  .then(result => {
    if (result == null) {
      res.status(404).json("Can't find products")
    } else {
      res.status(200).json(result)

    }
  })
});

module.exports = router;
