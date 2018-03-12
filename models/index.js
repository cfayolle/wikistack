const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikipage');

const Page = db.define('page', {
  page_title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  page_urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  page_content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  page_status: {
    type: Sequelize.ENUM('open', 'closed'),
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  tag: {
    type: Sequelize.ARRAY(Sequelize.STRING),
  }
}, {
  getterMethods: {
    route() {
      return '/wiki/' + this.page_urlTitle;
    }
  },
  hooks: {
    beforeValidate: (page, options) => {
      page.page_urlTitle = generateUrlTitle(page.page_title);
    }
  },
  renderedContent:
});

const User = db.define('user', {
  user_name:  {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_email:  {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
});


const generateUrlTitle = (title) => {
  if (title) {
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    return Math.random().toString(36).substring(2, 7);
  }
}

Page.belongsTo(User, { as: 'author' });

module.exports = {
  db,
  Page,
  User
};
