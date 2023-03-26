var express = require('express');
var router = express.Router();
const { ObjectId } = require("mongodb");
require('dotenv').config();

router.get('/', function(req, res, next) {
    req.app.locals.db.collection('categories').find().toArray()
    .then(results => {
    res.status(200).json(results)
    })    
});
  
router.post('/add', function(req, res, next) {
    let categoryName = req.body.name
    let token = req.body.token;
    if (token == process.env.ADMIN_KEY) {
        req.app.locals.db.collection('categories').insertOne({name: categoryName})
        .then(results => {
          res.status(200).json(results)
        })
      } else {
        res.status(401).json({message: "access denied!"})
    }

    console.log(req.body)
});

module.exports = router;