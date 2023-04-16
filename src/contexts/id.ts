import Client from '../structures/Client';
import Context from '../structures/Context';
import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction } from 'discord.js';
export default class IDContext extends Context {
    constructor(client: Client) {
        super(new ContextMenuCommandBuilder().setName('id').setType(ApplicationCommandType.User), client);
    }

    override async run(interaction: ContextMenuCommandInteraction) {
        const user = await interaction.guild!.members.cache.get(interaction.targetId);
        return interaction.reply(`${user?.user.tag} (${user?.id})`);
    }
}
