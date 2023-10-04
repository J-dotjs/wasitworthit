const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

var worth = 0

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

        if (submitted) {
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
                    if (i.customId === 'yes') {
                        hours(interaction, submitted.fields.getTextInputValue('gameName'), i);

                    } else if (i.customId === 'no') {
                        submitted.editReply({ content: `Interaction ended.`, components: [], ephemeral: true });
                    }
                    buttonCollector.stop();
                }
            })
        }
    }
}

async function hours(interaction, gameName, i) {
    const hoursModal = new ModalBuilder()
        .setCustomId('hoursModal')
        .setTitle('Hours');

    const hoursInput = new TextInputBuilder()
        .setCustomId('hours')
        .setLabel('Hours')
        .setStyle('Short')
        .setRequired(true);

    const hoursActionRow = new ActionRowBuilder().addComponents(hoursInput);

    hoursModal.addComponents(hoursActionRow);

    await i.showModal(hoursModal);

    const hoursSubmitted = await interaction.awaitModalSubmit({
        time: 60000,
        filter: i => i.user.id === interaction.user.id,
        max: 1,
    })

    if (hoursSubmitted) {
        worth = 0
        if (/^\d+$/.test(parseInt(hoursSubmitted.fields.getTextInputValue('hours')))) {
            worth += parseInt(hoursSubmitted.fields.getTextInputValue('hours'))
            hoursSubmitted.deferUpdate();
            console.log(worth)
            gameplay(interaction, gameName, worth);
        } else {
            return interaction.followUp({ content: `Hours must be a number, please try again.`, ephemeral: true });
        }
    }
}

async function gameplay(interaction, gameName, worth) {

    const selectGameplay = new StringSelectMenuBuilder()
        .setCustomId('selectGameplay')
        .setPlaceholder('Make a selection!')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Spectacular!')
                .setDescription('The gameplay is the best gameplay you have ever played in a game.')
                .setValue('spectacular'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Amazing!')
                .setDescription('The gameplay is amazing but it isn\'t spectacular.')
                .setValue('amazing'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Great')
                .setDescription('The gameplay is great.')
                .setValue('great'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Good')
                .setDescription('The gameplay isn\'t bad but it isn\'t great.')
                .setValue('good'),
            new StringSelectMenuOptionBuilder()
                .setLabel('OK')
                .setDescription('The gameplay is okay.')
                .setValue('ok'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Trash')
                .setDescription('The gameplay is so trash you wish you could refund the game')
                .setValue('trash')
        );

    const rowGameplay = new ActionRowBuilder().addComponents(selectGameplay);

    await interaction.followUp({
        content: `What would you rate the gameplay of ${gameName}?`,
        components: [rowGameplay],
        ephemeral: true
    })

    const selectGameplayCollector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000, max: 1 });

    selectGameplayCollector.on('collect', async i => {
        const selectionGameplay = i.values[0];
        i.deferUpdate()
        if (selectionGameplay === 'spectacular') {
            worth += 15
            console.log(worth)
            graphics(interaction, gameName, worth)
        } else if (selectionGameplay === 'amazing') {
            worth += 12
            console.log(worth)
            graphics(interaction, gameName, worth)
        } else if (selectionGameplay === 'great') {
            worth += 8
            console.log(worth)
            graphics(interaction, gameName, worth)
        } else if (selectionGameplay === 'good') {
            worth += 5
            console.log(worth)
            graphics(interaction, gameName, worth)
        } else if (selectionGameplay === 'ok') {
            worth += 2
            console.log(worth)
            graphics(interaction, gameName, worth)
        } else if (selectionGameplay === 'trash') {
            worth += 0.25
            interaction.followUp({ content: worth })
            graphics(interaction, gameName, worth)
        }

    })
}

async function graphics(interaction, gameName, worth) {

    const selectGraphics = new StringSelectMenuBuilder()
        .setCustomId('selectGraphics')
        .setPlaceholder('Make a selection!')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Fabulous!')
                .setDescription('The graphics are the best graphics you have ever seen.')
                .setValue('fabulous'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Great')
                .setDescription('The graphics are great.')
                .setValue('great'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Mid')
                .setDescription('The graphics aren\'t bad but they aren\'t great.')
                .setValue('mid'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Lower end')
                .setDescription('The graphics are okay.')
                .setValue('low'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Awful')
                .setDescription('The graphics are so bad your eyes bleed.')
                .setValue('awful')
        );

    const rowGraphics = new ActionRowBuilder()
        .addComponents(selectGraphics);

    await interaction.followUp({
        content: `What would you rate the graphics of ${gameName}?`,
        components: [rowGraphics],
        ephemeral: true
    });

    const selectGraphicsCollector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });

    selectGraphicsCollector.on('collect', async i => {
        const selectionGraphics = i.values[0];

        if (selectionGraphics === 'fabulous') {
            worth += 8
        } else if (selectionGraphics === 'great') {
            worth += 5
        } else if (selectionGraphics === 'mid') {
            worth += 3.5
        } else if (selectionGraphics === 'low') {
            worth += 2
        } else if (selectionGraphics === 'awful') {
            worth += 0.5
        }

        interaction.followUp({ content: worth })
        stability(interaction, gameName, worth)
        selectGraphicsCollector.stop();
    });
}

async function stability(interaction, gameName, worth) {
    const selectStability = new StringSelectMenuBuilder()
        .setCustomId('selectStability')
        .setPlaceholder('Make a selection!')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Smooth')
                .setDescription('The game is smooth and lag free.')
                .setValue('smooth'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Runnable')
                .setDescription('The game is runnable and comfortable.')
                .setValue('runnable'),
            new StringSelectMenuOptionBuilder()
                .setLabel('OK')
                .setDescription('The game jitters a bit.')
                .setValue('ok'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Potato')
                .setDescription('The game literally feels like you\'re playing on a potato.')
                .setValue('potato')
        );

    const rowStability = new ActionRowBuilder()
        .addComponents(selectStability);

    await interaction.followUp({
        content: `What would you rate the stability of ${gameName}?`,
        components: [rowStability],
        ephemeral: true
    })

    const selectStabilityCollector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
    
    selectStabilityCollector.on('collect', async i => {
        const selectionStability = i.values[0];
        if (selectionStability === 'smooth') {
            worth += 2
        }
        else if (selectionStability === 'runnable') {
            worth += 1
        }
        else if (selectionStability === 'ok') {
            worth += 0.5
        }
        else if (selectionStability === 'potato') {
            worth += 0
        }
        interaction.followUp({ content: worth })

        selectStabilityCollector.stop();
    })
}