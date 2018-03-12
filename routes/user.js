const express = require('express');
const userRouter = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

userRouter.get('/', (req, res, next) => {
  User.findAll()
  .then(function(users){
    res.render('users', { users });
  })
  .catch(next);
});

userRouter.get('/:id', (req, res, next) => {
  const userId = req.params.id;
  const userPromise = User.findById(userId);
  const pagesPromise = Page.findAll({
    where: {
      authorId: userId
    }
  });
  Promise.all([userPromise, pagesPromise])
  .then(function(values) {
    const user = values[0];
    const pages = values[1];
    res.render('userpage', {user, pages});
  })
  .catch(next);
});

userRouter.post('/', (req, res, next) => {
  res.send('response to POST request to /user/');
  // create a user in the db
});

userRouter.put('/:id', (req, res, next) => {
  res.send('response to PUT request to /user/'  + req.params.id);
  // update user #id in the db
});

userRouter.delete('/:id', (req, res, next) => {
  res.send('response to DELETE request to /user/'  + req.params.id);
  // delete user #id in the db
});

module.exports = userRouter;
