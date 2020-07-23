const AutoRole = require('./models/AutoRoles');

module.exports = {
	name: 'iam',
	description: 'gives or removes a role to the user based on a name',
	alias: [],
	async execute(message, args) {
		if (args.length <= 0) return message.reply('Please precise the name of the role you want');
		const ar = await AutoRole.findOne({ where: { name: args.join(' ') } });

		if (ar) {

			const role = await message.guild.roles.fetch(ar.role);

			if (!message.member.roles.cache.find(r => r.id == role.id)) {
				message.member.roles.add(role);
				message.channel.send(`Added ${role.name}`);
			}
			else{
				message.member.roles.remove(role);
				message.channel.send(`Removed ${role.name}`);
			}
		}
		else {
			message.reply('No autorole with that name exists');
		}
	},

};