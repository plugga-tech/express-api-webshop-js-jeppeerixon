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
  let categoryName = req.body.category
  req.body.category = new ObjectId(categoryName)
    let token = req.body.token;
    if (token == process.env.ADMIN_KEY) {
      req.app.locals.db.collection('products').insertOne(req.body)
      .then(result => {
        console.log("New product added" + result)
        res.status(200).json(result)
        })
      } else {
        res.status(401).json({message: "access denied! failed to add product"})
    }
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

router.get('/category/:category', function(req, res, next) {
  let categoryId = req.params.category;
  console.log(categoryId)
  req.app.locals.db.collection("products").find({"category": new ObjectId(categoryId)}).toArray()
  .then(results => {
    if (results == null) {
      res.status(404).json(categoryId)
    } else {
      res.status(200).json(results)

    }
  })
});

module.exports = router;
