const express = require('express');
const router  = express.Router();


//GET route to show About page
router.get('/about', (req, res, next) => {
  res.render('about/about')
});

module.exports = router;