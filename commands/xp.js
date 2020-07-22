// Defines the table for experience like done in index.js
const Experience = require('./models/Experience');

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