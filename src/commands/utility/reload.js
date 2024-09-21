const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction) {
			const commandName = interaction.options.getString('command', true).toLowerCase();
			const command = interaction.client.commands.get(commandName);
			if (!command) {
				return interaction.reply(`There is no command with name \`${commandName}\`!`);
			}
			delete require. cache[require.resolve(`../user/${commandName}.js`)];
			try {
				const newCommand = require(`../user/${command.data.name}.js`);
				interaction.client.commands.set(newCommand.data.name, newCommand);
				await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
				console.log(`\x1b[32m Reload success! \`${commandName}\` has been updated. \x1b[0m`);
			} catch (error) {
				console.error(error);
				await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
			}
		},
		
};

