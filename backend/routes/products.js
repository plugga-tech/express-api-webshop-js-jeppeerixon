var express = require('express');
var router = express.Router();
const { ObjectId } = require("mongodb");

/* GET users listing. */
router.get('/', function(req, res, next) {  
  req.app.locals.db.collection('products').find().toArray()
  .then(results => {
    let printHTML = '<div><h3>Products:</h3>'

    for (i in results) {
      printHTML += '<p>' + results[i]._id + ' - ' + results[i].name +
      ' - ' + results[i].description + ' - ' + results[i].price + 
      ' - ' + results[i].lager + 
      '</p>'
    }

    printHTML += '</div>'

    res.send(printHTML);
  })
});

router.post('/add', function(req, res, next) {

  req.app.locals.db.collection('products').insertOne(req.body)
  .then(result => {
    console.log("New product added" + result)
  })
    

  res.send('Product added');
});

router.get('/:productId', function(req, res, next) {
  productId = req.params.productId;
  console.log(productId);

  req.app.locals.db.collection("products").findOne({"_id": new ObjectId(productId)})
  .then(result => {
    if (result == null) {
      res.status(500).json("Can't find products")
    } else {
      res.json(result)

    }
  })
});

module.exports = router;
