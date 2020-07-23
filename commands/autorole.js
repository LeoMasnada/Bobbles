const AutoRoles = require('./models/AutoRoles');

module.exports = {
	name: 'autorole',
	description: 'adds or removes a role as self assignable',
	alias: ['ar'],
	async execute(message, args) {
		AutoRoles.sync();

		if (args[0] == 'add') {
			const ar = await AutoRoles.findOne({
				where: {
					role: message.mentions.roles.first().toString(),
				},
			});
			if (!ar) {
				const name = args.join(' ').split('"')[1];
				await AutoRoles.create({
					role: message.mentions.roles.first().id,
					name: name,
				});
				message.reply('Added ' + message.mentions.roles.first().name + ' to the self assignable roles');
			}
		}
		else if (args[0] == 'remove') {
			const ar = await AutoRoles.findOne({
				where: {
					role: message.mentions.roles.first().id,
				},
			});
			if (ar) {
				try{
					await AutoRoles.destroy({
						where: {
							role: message.mentions.roles.first().id,
						},
					});
					message.reply('Removed ' + message.mentions.roles.first().name + ' from the self assignable roles');
				}
				catch(e) {
					console.log('Error deleting autorole ' + e);
				}
			}
			else {
				message.channel.send('No autorole logged for that role');
			}
		}
		else{
			message.reply('Please precise \'add\' or \'remove\'');
		}
	},
};