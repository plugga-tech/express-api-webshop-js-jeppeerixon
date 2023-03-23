var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('ORDERS');
});

router.get('/all', function(req, res, next) {  
  req.app.locals.db.collection('orders').find().toArray()
  .then(results => {
    res.status(200).json(results)
  })
});

router.post('/add', function(req, res, next) {

  req.app.locals.db.collection('orders').insertOne(req.body)
  .then(result => {
    console.log("New order added")
    res.status(200).json(result)
  })
});


module.exports = router;
