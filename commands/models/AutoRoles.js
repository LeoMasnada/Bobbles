// Import Sequelize library
const Sequelize = require('sequelize');
// Imports the connection settings
const sequelize = require('../database/connection');

// Creates and exports the model for the custom autorole table
module.exports = sequelize.define('autoRoles', {
	role: {
		type: Sequelize.STRING,
		unique: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
});