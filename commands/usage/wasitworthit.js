const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wasitworthit')
        .setDescription('Start the questionaire to figure out if your game was worth it!'),

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('gameNameModal')
            .setTitle('Game name');

        const nameInput = new TextInputBuilder()
            .setCustomId('gameName')
            .setLabel('Game name')
            .setStyle('Short')
            .setRequired(true);

        const gameNameActionRow = new ActionRowBuilder().addComponents(nameInput);

        modal.addComponents(gameNameActionRow);

        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error(error)
            return null
        })

        if(submitted) {
            const yesButton = new ButtonBuilder()
                .setCustomId('yes')
                .setLabel('Yes')
                .setStyle('Success');

            const noButton = new ButtonBuilder()
                .setCustomId('no')
                .setLabel('No')
                .setStyle('Danger');

            const confirmationActionRow = new ActionRowBuilder().addComponents(yesButton, noButton);


            submitted.reply({ content: `The game is ${submitted.fields.getTextInputValue('gameName')}. Is that correct?`, components: [confirmationActionRow], ephemeral: true });

            const buttonCollector = interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000
            })

            buttonCollector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                    i.reply({ content: `${i.user.id} clicked on the ${i.customId} button.`, ephemeral: true });
                    buttonCollector.stop();
                } else {
                    i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                }
            })

        }

    }
}