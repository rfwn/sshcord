import { Interaction } from 'discord.js';
import Event from '../../structures/Event';

export default class InteractionCreate extends Event {
    override async run(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            if (this.client.commands.has(interaction.commandName)) {
                try {
                    await this.client.commands.get(interaction.commandName)!.run(interaction);
                } catch (error) {
                    this.client.logger.error(`Command ${interaction.commandName} has an error: ${error.message}`);
                    if (this.client.config.debug) {
                        console.log(error);
                    }
                    await interaction.reply({
                        content:
                            'This command has an error, please try again. (If you are consistently observing this error please contact support)',
                        ephemeral: true,
                    });
                }
            }
        } else if (interaction.isContextMenuCommand()) {
            if (this.client.contexts.has(interaction.commandName)) {
                try {
                    await this.client.contexts.get(interaction.commandName)!.run(interaction);
                } catch (error) {
                    this.client.logger.error(`Context ${interaction.commandName} has an error: ${error.message}`);
                    if (this.client.config.debug) {
                        console.log(error);
                    }
                    await interaction.reply({
                        content:
                            'This command has an error, please try again. (If you are consistently observing this error please contact support)',
                        ephemeral: true,
                    });
                }
            }
        }
    }
}
