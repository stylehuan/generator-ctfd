var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function(req, res) {
    res.render('index');
});

//router.get("/about", function(req, res){
//    res.render('home/about');
//});
module.exports = router;