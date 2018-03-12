const express = require('express');
const router = express.Router();
const wikiRouter = require('./wiki');
const userRouter = require('./user');
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.use('/wiki', wikiRouter);
router.use('/users', userRouter);
router.get('/', (req, res, next) => {
  Page.findAll()
  .then(function(pages){
    res.render('index', { pages: pages });
  })
  .catch(next);
});

router.get('/search', (req, res, next) => {
  res.render('tagsearch');
})

module.exports = router;
