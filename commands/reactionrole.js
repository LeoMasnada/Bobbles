// Imports the Autorole table model
const ReactionRoles = require('./models/ReactionRoles');
const Discord = require('discord.js');

module.exports = {
	name: 'reactionrole',
	description: '',
	alias: ['rr'],
	async execute(message, args) {
		// Loads or creates the table of custom reaction table
		ReactionRoles.sync();

		// Variables for the different pieces of data stored in a row of the database
		let channelReaction, messageReaction, reaction, role;
		// Temporary variable to check inside the database
		let tmpDBReference;
		// Accessor to the channel where the command has been called at
		const currentChannel = message.channel;

		// Holder for the messages sent by the bot
		let tmpMessage;

		// User requests to add a new entry
		if(args[0] == 'add') {

			/* Get Role */
			// Prompts the user to ask them the role they want to associate
			tmpMessage = await currentChannel.send('What role will this reaction be for ? (respond with @RoleName)\nAwaiting 10 seconds.');
			// Grab the next 1 message from the same author within the next 10 seconds
			await currentChannel.awaitMessages((m => m.author.id == message.author.id), { max: 1, timeout: 10000 })
			// After collection
				.then(collected =>{
					// If something has been collected, try to save the first role mentionned, deletes the user's answer
					if (collected.first().mentions.roles.first()) {
						role = collected.first().mentions.roles.first();
						collected.first().delete();
					}
					// Remove the prompt message
					tmpMessage.delete();
				});

			// If no role has been extracted from the process, aborts
			if (!role) return currentChannel.send('Aborting, no role has been injected.');

			// Check if role is already used
			tmpDBReference = await ReactionRoles.findOne({ where:{ RoleID: role.id } });
			// Aborts if role is already existing
			if (tmpDBReference) return currentChannel.send('This role already has an existing reaction associated to it.');

			/* Get reaction */
			// Prompts the user to provide a reaction to use
			tmpMessage = await currentChannel.send('What reaction will be used to give or take this role ? (react to this message with the desired reaction)\nAwaiting 10 seconds.');
			// Grabs the next 1 emote added as reaction to the message from the same user
			await tmpMessage.awaitReactions(((rea, user)=> user == message.author), { max:1, timeout: 10000 })
			// After grabbing or time passed
				.then(await (collected =>{
					// If something has been fetched
					if (collected.first()) {
						// Saves the emoji grabbed
						reaction = collected.first().emoji;
						// Removes all reaction from the message
						tmpMessage.reactions.removeAll();
					}
				}));
			// Attempts to recreate the reaction to test usability
			await tmpMessage.react(reaction)
			// If usage is impossible, notifies the user, logs the error and resets the saved emoji
				.catch(()=>{
					currentChannel.send('Error while creating the reaction.');
					console.error;
					reaction = null;
				});
			// Deletes the prompt
			tmpMessage.delete();

			// If no reaction has been extracted from the process, aborts and notifies user
			if (!reaction) return currentChannel.send('Cannot use this emote as a reaction, please provide an emote I can use.');

			// Get channel
			// Prompt the user to provide the channel in which the message holding the reaction will be in
			tmpMessage = await currentChannel.send('What channel will the reaction be available in ? (respond with #ChannelName)\nAwaiting 10 seconds.');
			// Grab next 1 message from same author
			await currentChannel.awaitMessages((m => m.author.id == message.author.id), { max: 1, timeout: 10000 })
			// Once grabbed
				.then(collected => {

					// If a channel mention exists
					if (collected.first().mentions.channels.first()) {
						// Save it
						channelReaction = collected.first().mentions.channels.first();
					}
					// Delete prompt
					tmpMessage.delete();
					// Delete grabbed message
					collected.first().delete();

				});

			// If no channel was extracted from the process, aborts and notifies user
			if (!channelReaction) return currentChannel.send('Aborting, no channel has been injected.');

			/* Get message */
			// Temporary variable for information transfer between promisses
			let tmp;
			// Prompts user to provide the ID of the message that will hold the reaction
			tmpMessage = await currentChannel.send('What message will the reaction be available on ? (respond with the message ID, either copying it or taking the last part of the message\'s link)\nAwaiting 10 seconds.');
			// Grab the next 1
			await currentChannel.awaitMessages((m => m.author.id == message.author.id), { max: 1, timeout: 10000 })
			// After grabbing
				.then(collected =>{
					// If something has been grabbed
					if(collected.first()) {
						// Saves it and deletes the message
						tmp = collected.first().content;
						collected.first().delete();
					}
					// Delete the prompt
					tmpMessage.delete();
				});

			// Try to fetch the message associated with the provided information
			messageReaction = await channelReaction.messages.fetch(tmp);
			// If no message has been extracted from the process aborts and notifies user
			if (!messageReaction) return currentChannel.send('Aborting, no valid message ID has been injected.');

			// Try to create the new entry
			try {
				await ReactionRoles.create({
					ChannelID:channelReaction.id,
					MessageID:messageReaction.id,
					ReactionID:reaction.id,
					RoleID:role.id,
				});

				// Prepare an Embed message to show the result of the creation process
				const embed = new Discord.MessageEmbed()
					.setColor('#FF0000')
					.setTitle('Newly created reaction role')
					.addField('Role', `${role}`, true)
					.addField('Message', `${messageReaction.url}`, true)
					.addField('Reaction', `${reaction}`, true);

				// Send the embed
				currentChannel.send(embed);
			}
			// If the creation or the embed fails
			catch (error) {
				// Notifies user in the channel and logs the error
				currentChannel.send('Error while creating the entry.');
				console.log(error);
			}

			// Tries to set up the new reaction
			try{
				messageReaction.react(reaction);
			}
			// If the reaction can't be put on
			catch (error) {
				// Notifies the user in channel and logs the error
				currentChannel.send('Error while creating the reaction.');
				console.log(error);
			}

		}
		// If the user requests to remove an entry
		else if (args[0] == 'remove') {
			// Logs the first mention to a role in the message
			role = message.mentions.roles.first();
			// If no role was precised with the command, notifies user
			if (!role) return message.reply('please provide a role to remove from the list with the remove command.');

			// Attempts to find an entry with the same role as mentioned by the user
			const rr = await ReactionRoles.findOne({
				where:{
					RoleID: role.id,
				},
			});

			// If an entry is found
			if (rr) {
				// Attempt to delete it
				try {
					ReactionRoles.destroy({
						where:{
							RoleID: role.id,
						},
					});
					// Notifies user on completion
					currentChannel.send('Successfully removed the entry');
					// Find the channel where the role was accessible
					await message.guild.channels.cache.find(c => c.id == rr.ChannelID)
					// Find the message on which the reaction was
						.messages.fetch(rr.MessageID)
					// Removes the reactions that were granting the role
						.then(m=> m.reactions.resolve(rr.ReactionID).remove());

				}
				// If an error happens on the deletion, notifies the user and logs the error
				catch (error) {
					currentChannel.send('Error while deleting this reaction.');
					console.log(error);
				}
			}
		}
		// If neither 'add' or 'remove' was precised, asks the user to precise it
		else{
			message.channel.send('Please precise your interaction with \'add\' or \'remove\'.');
		}
	},
};