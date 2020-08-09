// Import Sequelize library
const Sequelize = require('sequelize');
// Imports the connection settings
const sequelize = require('../database/connection');

module.exports = sequelize.define('reactionRoles', {
	ChannelID:{
		type: Sequelize.STRING,
		unique: false,
	},
	MessageID:{
		type: Sequelize.STRING,
		unique: true,
	},
	ReactionID: {
		type: Sequelize.STRING,
		unique: true,
	},
	RoleID: {
		type: Sequelize.STRING,
		unique: true,
	},
});