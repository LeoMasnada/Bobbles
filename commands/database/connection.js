// Import the sequelize library
const Sequelize = require('sequelize');

// Looks for the database file to load and log into
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

// Exports the connection to the database
module.exports = sequelize;