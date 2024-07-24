const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('petCheri', 'postgres', 'amine12345', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
