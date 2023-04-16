import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';
export default class PingCommand extends Command {
    constructor(client: Client) {
        super(new SlashCommandBuilder().setName('ping').setDescription('Shows ping'), client, {});
    }

    override async run(interaction: ChatInputCommandInteraction) {
        const m = await interaction.channel!.send('.');
        const messageTimestamp = m.createdTimestamp;
        m.delete();
        const embed = new EmbedBuilder()
            .addFields(
                { name: '🏓 Ping', value: `> \`${messageTimestamp - interaction.createdTimestamp}ms\``, inline: true },
                { name: '⌛ API Latency', value: `> \`${Math.round(this.client.ws.ping)}ms\``, inline: true },
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
}
