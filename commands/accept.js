module.exports = {
	name: 'accept',
	description: 'allows a user in the server',
	alias: ['a'],
	async execute(message, args) {
		if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send('Cannot execute that action');
		const user = message.mentions.members.first();
		const chan = await message.guild.channels.cache.find(ch => ch.name == user.displayName.toLowerCase().replace(/[^a-zA-Z ]/g, ''));
		const role = await message.guild.roles.fetch('735825926511656990');
		const roleToRemove = await message.guild.roles.fetch('784866130292506636');
		user.roles.add(role);
		user.roles.remove(roleToRemove);
		chan.delete();
	},
};