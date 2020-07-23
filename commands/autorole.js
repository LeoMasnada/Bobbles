// Imports the Autorole table model
const AutoRoles = require('./models/AutoRoles');

module.exports = {
	name: 'autorole',
	description: 'adds or removes a role as self assignable',
	alias: ['ar'],
	async execute(message, args) {
		// Loads or creates the table in the database
		AutoRoles.sync();

		// If the user requests to add a new autorole
		if (args[0] == 'add') {
			// Try to fetch an already existing entry with the same role
			const ar = await AutoRoles.findOne({
				where: {
					role: message.mentions.roles.first().toString(),
				},
			});

			// If the entry doesn't exist
			if (!ar) {
				// Fetches the first occurence of text between double quotes and removes the quotes from the string value
				const name = args.join(' ').match(/"(.*?)"/ig).shift().replace(/"/g, '');
				// If no text was given between double quotes, informs the user and aborts
				if (!name) return message.reply('Please provide a name for the autorole between " (double quotes)');

				// If the name was valid, creates the new entry
				await AutoRoles.create({
					role: message.mentions.roles.first().id,
					name: name,
				});

				// Notifies the user of the new entry
				message.reply('Added ' + message.mentions.roles.first().name + ' to the self assignable roles');
			}
			// If an entry already exists for that role, notifies the user
			else{
				message.reply(`This role is already available with the name ${ar.name}`);
			}
		}
		// If the user requests to remove an existing entry
		else if (args[0] == 'remove') {
			// Try to fetch the requested entry
			const ar = await AutoRoles.findOne({
				where: {
					role: message.mentions.roles.first().id,
				},
			});
			// If the entry exists
			if (ar) {
				try{
					// Attempts to remove the entry
					await AutoRoles.destroy({
						where: {
							role: message.mentions.roles.first().id,
						},
					});
					// Notifies user on success
					message.reply('Removed ' + message.mentions.roles.first().name + ' from the self assignable roles');
				}
				catch(e) {
					// Notifies console on failure
					console.log('Error deleting autorole ' + e);
				}
			}
			// If no entry was found with the given role
			else {
				// notifies the user
				message.channel.send('No autorole logged for that role');
			}
		}
		// If the user didn't precise a key word
		else{
			// Notifies the user
			message.reply('Please precise \'add\' or \'remove\'');
		}
	},
};