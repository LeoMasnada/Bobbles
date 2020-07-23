const AutoRoles = require('./models/AutoRoles');

module.exports = {
	name: 'autorole',
	description: 'adds or removes a role as self assignable',
	alias: ['ar'],
	async execute(message, args) {

		switch(args[0]) {
		case 'add':
			const ar = AutoRoles.findOne({
				where: {
					role: message.mentions.roles.first(),
				},
			});
			if (!ar){
				const name = args.join(' ').split('"')[1];
				await AutoRoles.create({
					role: message.mentions.roles.first(),
					name: name,
				});
			}
			break;

		case 'remove':

			break;

		default:
			message.reply('Please precise \'add\' or \'remove\'');
		}
	},
};