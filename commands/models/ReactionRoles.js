// Import Sequelize library
const Sequelize = require('sequelize');
// Imports the connection settings
const sequelize = require('../database/connection');

module.exports = sequelize.define('reactionRoles', {
	MessageID:{
		type: Sequelize.STRING,
		unique: true,
	},
	Reaction: {
		type: Sequelize.STRING,
		unique: true,
	},
	Role: {
		type: Sequelize.STRING,
		unique: true,
	},
});