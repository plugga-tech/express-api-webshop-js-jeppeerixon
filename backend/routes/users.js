var express = require('express');
var router = express.Router();
const { ObjectId } = require("mongodb");

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.app.locals.db.collection('users').find().toArray()
  .then(results => {
    let printHTML = '<div><h3>Users:</h3>'

    for (i in results) {
      printHTML += '<p>' + results[i]._id + ' - ' + results[i].name + ' - ' + results[i].email + '</p>'
    }

    printHTML += '</div>'

    res.send(printHTML);
  })
});

router.post('/', function(req, res, next) {
  const userId = req.body
  console.log(userId)
  req.app.locals.db.collection('users').findOne({"_id": new ObjectId(userId)})
  .then(result => {
    console.log("Hitta user", result);

    res.json(result)
  })
});

router.post('/add', function(req, res, next) {

  req.app.locals.db.collection('users').insertOne(req.body)
  .then(result => {
    console.log("1 user inserted" + result);
  })
    

  res.send('USERS ROUTE');
});

module.exports = router;
