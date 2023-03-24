var express = require('express');
var router = express.Router();
const crypto = require("crypto-js");
const { ObjectId } = require("mongodb");
require('dotenv').config();

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

  let newUser = { name: req.body.name, email: req.body.email };
  let passwordToSave = crypto.SHA3(req.body.password).toString();
  newUser.password = passwordToSave;

  console.log("new user", newUser);

  req.app.locals.db.collection('users').insertOne(newUser)
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
    else if (crypto.SHA3(password).toString() == result.password) {
      if (email == 'admin@mail.com') {
        res.cookie('adminCookie', process.env.ADMIN_KEY, {
          maxAge: 1000000,
          httpOnly: true,
          secure: true, 
          withCredentials: 'include',
          path: "/",
        })

      } else {
        res.cookie('loginCookie', 'loggedIn', {
          maxAge: 1000000,
          httpOnly: true,
          secure: true, 
          withCredentials: 'include',
          path: "/",
        })
      }      
      res.status(200).json(result)
    }
    else {
      res.status(401).json("Incorrect password or username")
    }
  })
});

module.exports = router;