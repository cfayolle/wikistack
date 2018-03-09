const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost:5432/petpeople');

const Person = db.define('people', {
  name: Sequelize.STRING
});

module.exports = {
  db,
  Person
};


