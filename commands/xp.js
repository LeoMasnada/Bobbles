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

// Defines the table for experience like done in index.js
const Experience = sequelize.define('xp', {
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

module.exports = {
	name: 'xp',
	description: 'shows how much experience you have',
	async execute(message) {

		// Looks for the user's experience in the database
		const xp = await Experience.findOne({
			where: {
				user: message.author.id,
			},
		});

		// If the value has been correctly loaded, prints the value in the channel
		if (xp) {
			return message.channel.send(`You currently have ${xp.experience} xp points`);
		}
		// Logs in the channel if an error has been triggered
		return message.channel.send('An error has been encountered while looking for your experience level.');
	},
};