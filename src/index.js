//set filesystem
const fs = require('node:fs');
//path module provides utilities for working with file and directory paths
const path = require('node:path');
//set required discord js classes
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, ActivityType } = require('discord.js');
//set token location
const { token } = require('../config.json');
//set which events the bot will receive see https://discordjs.guide/popular-topics/intents.html#privileged-intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
//create commands Collection
client.commands = new Collection();

//set folder path for commands directory by joining the segmants ie ('/foo, 'bar') returns "/foo/bar"
//__dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file
const foldersPath = path.join(__dirname, 'commands');
//the fs.readdirSync() method is used to synchronously read the contents of a given directory. here commandFolders represents the data read from foldersPath sub dirs
const commandFolders = fs.readdirSync(foldersPath);

//module.exports = { client };

//loop through the folders in commandFolders aka commands/
for (const folder of commandFolders) {
	//set constant for the path of the current iterated folder ie commands, utility == commands/utility
	const commandsPath = path.join(foldersPath, folder);
	//read all javascript files
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	//loop through all the javascript files if there are multiple
	for (const file of commandFiles) {
		//set the file path again for the file iteself
		const filePath = path.join(commandsPath, file);
		//require it as a command
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module. if statement to confirm if the data and execute variable are in the command file
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//listener and handling for interactions
client.on(Events.InteractionCreate, async interaction => {
	const command = interaction.client.commands.get(interaction.commandName);
	//if not command return
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	//if the interaction is chat command then start command handling
	if (interaction.isChatInputCommand()) {
		//command handling
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	//if the interaction is autocomplete start autocomple handling
	} else if (interaction.isAutocomplete()) {
		//auto complete handling
		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
	};
});

//listen for the clientready event, console log and set activity 
client.once(Events.ClientReady, readyClient => {
	console.log(`Scrappy has been found! Logged in as ${readyClient.user.tag}`);
	client.user.setActivity("Throwing traps at hunters.", { type: 4 });
});

//login using token
client.login(token);