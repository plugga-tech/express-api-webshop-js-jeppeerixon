var express = require('express');
var router = express.Router();
const { ObjectId } = require("mongodb");

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.app.locals.db.collection('users').find().project({password: false}).toArray()
  .then(results => {
    res.status(200).json(results)
    
  })
});

router.post('/', function(req, res, next) {
  const userId = req.body
  //lägg till check för valid id key
  console.log(userId)
  req.app.locals.db.collection('users').findOne({"_id": new ObjectId(userId)})
  .then(result => {
    if (result == null) {
      res.status(500).json("Can't find user")
    } else {
      res.status(200).json(result)

    }    
  })
});

router.post('/add', function(req, res, next) {

  req.app.locals.db.collection('users').insertOne(req.body)
  .then(result => {
    res.status(200).json(result)
  })
});

router.post('/login', function(req, res, next) {
  const { email, password } = req.body;

  req.app.locals.db.collection('users').findOne({"email": email})  
  .then(result => {
    if (result == null) {
      res.status(500).json("Can't find user")
    }
    else if (result.password === password) {
      res.status(200).json(result)
    }
    else {
      res.status(401).json("Incorrect password or username")
    }
  })
});

module.exports = router;