const express = require('express');
const wikiRouter = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


wikiRouter.get('/', (req, res, next) => {
  res.redirect('/');
});

wikiRouter.get('/add', (req, res, next) => {
  res.render('addpage');
});

wikiRouter.get('/search', (req, res, next) => {
  const tag = req.query.tag_search;
  Page.findAll({
    where: {
      tag: {
        [Op.overlap] : [tag]
      }
    }
  })
  .then(pages => {
    res.render('tagresults', { pages, tag });
  });
});


wikiRouter.get('/:title/similar', (req, res, next) => {
  const titlePage = req.params.title;
  Page.findOne({
    where: {
      page_urlTitle: titlePage
    }
  })
  .then((result) => {
    console.log("result:", result);
    return Page.findAll({
      where: {
        tag: {
          [Op.overlap] : result.tag,
        },
        page_title: {
          [Op.ne]: result.page_title
        }
      }
    })
  })
  .then(pages => {
    res.render('similar', { pages });
  });
});

wikiRouter.get('/:url', (req, res, next) => {
  Page.findOne({
    where: {
      page_urlTitle: req.params.url
    },
    include: [
      {model: User, as: 'author'}
    ]
  })
  .then(foundPage => {
    if (foundPage === null){
      res.status(404).send();
    } else {
      const tags = foundPage.tag;
      res.render('wikipage', {
        foundPage,
        tags
      });
    }
  });
});

wikiRouter.post('/', (req, res, next) => {
  User.findOrCreate({
    where: {
      user_name: req.body.user_name,
      user_email: req.body.user_email,
    }
  })
  .then(function (values) {
    const user = values[0];
    const tags = req.body.page_tags.split(' ').map(elem => {
      if( elem[0] === '#' ) {
        return elem.slice(1);
      }
      else return elem;
    });
    console.log('tags:', tags);
    const page = Page.build({
      page_title: req.body.page_title,
      page_content: req.body.page_content,
      page_status: 'closed',
      tag: tags
    });
    return page.save().then(function (page) {
      return page.setAuthor(user);
    });
  })
  .then(function (page) {
    res.redirect(page.route);
  })
  .catch(next);
});


module.exports = wikiRouter;
