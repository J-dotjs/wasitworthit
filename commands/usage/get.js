const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start the questionaire to figure out if your game was worth it!'),

    async execute(interaction) {

        interaction.reply('WIP!');

    }
}