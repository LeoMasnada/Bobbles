// Import Sequelize library
const Sequelize = require('sequelize');
// Imports the connection settings
const sequelize = require('../database/connection');

// Creates and exports the model for the experience table
module.exports = sequelize.define('xp', {
	user: {
		type: Sequelize.STRING,
		unique: true,
	},
	experience: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});