// Imports the autorole table model
const AutoRole = require('./models/AutoRoles');

module.exports = {
	name: 'iam',
	description: 'gives or removes a role to the user based on a name',
	alias: [],
	async execute(message, args) {
		// If the user didn't precise a name
		if (args.length <= 0) return message.reply('Please precise the name of the role you want');

		// Concatenates all the message aside from the command to user it as a name, then try to fetch an entry with this name
		// (Makes possible to user a name with multiple words)
		const ar = await AutoRole.findOne({ where: { name: args.join(' ') } });

		// If an entry exists
		if (ar) {

			// Find that role in the guild
			const role = await message.guild.roles.fetch(ar.role);

			// If the user doesn't have the said role
			if (!message.member.roles.cache.find(r => r.id == role.id)) {

				// Gives the user the role and notifies them
				message.member.roles.add(role);
				message.channel.send(`Added ${role.name}`);
			}
			// If the user already has the role
			else{

				// Removes the role from the user and notifies them
				message.member.roles.remove(role);
				message.channel.send(`Removed ${role.name}`);
			}
		}
		// If no entry for that role was found
		else {
			// Notidies the user
			message.reply('No autorole with that name exists');
		}
	},

};