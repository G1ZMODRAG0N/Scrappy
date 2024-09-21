const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const traitList = require('../../../hunt_api/api/trait_list.json');
const traits = require('../../../hunt_api/api/traits.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trait')
		.setDescription('Search')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Trait to look up.')
				.setRequired(true)
				.setAutocomplete(true)
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const filtered = traitList.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		)
	},
	async execute(interaction) {
		const input = interaction.options.getString('name', true).toLowerCase();
		console.log('input:' + input);
		const trait = traits.find(array => array.name.toLowerCase() == input);
		const background_image = new AttachmentBuilder(path.join(__dirname, '../../../hunt_api/images/traits_large/', trait.background));
		const thumbnail_image = new AttachmentBuilder(path.join(__dirname, '../../../hunt_api/images/traits_small/', trait.icon));
		const background_path = 'attachment://' + trait.background;
		const thumbnail_path = 'attachment://' + trait.icon;
		console.log(background_path);
		console.log(thumbnail_path);
		//build embed from user input
		const embed = new EmbedBuilder()
			.setColor('#8c0008')
			.setTitle(trait.name)
			.setURL(trait.url)
			.setAuthor({ name: 'TRAIT' })
			.setDescription(trait.description)
			.setThumbnail(thumbnail_path)
			.addFields(
				{ name: 'POINTS:', value: `\`${trait.cost}\`` },
				{ name: 'CATEGORY:', value: `\`${trait.category}\``, inline: false },
				{ name: 'UNLOCK LVL:', value: `\`${trait.unlock_at}\``, inline: false },
				{ name: 'EVENT ONLY:', value: trait.is_event ? "✔" : "❌", inline: true },
				{ name: 'BURN:', value: trait.burn ? "✔" : "❌", inline: true },
				{ name: 'SCARCE:', value: trait.scarce ? "✔" : "❌", inline: true }
				//.addFields(
				//	{ name: 'AMMUNITION TYPE:', value: 'Long', inline: true },
				//	{ name: 'MELEE DAMAGE TYPE', value: 'Blunt/Blunt', inline: true },
			)
			.setImage(background_path)
		//.setTimestamp()
		//.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		await interaction.reply({ embeds: [embed], files: [background_image, thumbnail_image] });
	}
};