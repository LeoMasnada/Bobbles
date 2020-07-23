// Import Sequelize library
const Sequelize = require('sequelize');
// Imports the connection settings
const sequelize = require('../database/connection');

// Creates and exports the model for the custom reactions table
module.exports = sequelize.define('banWords', {
	word: {
		type: Sequelize.STRING,
		unique: true,
	},
});