const express = require('express');
const router = express.Router();

// @route  GET api/post
// @desc   Test route
// @access Public
router.get('/', function(req, res){
    res.send('Post route');
}); 

module.exports = router;