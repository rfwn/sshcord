import { ToAPIApplicationCommandOptions } from 'discord.js';
import Event from '../../structures/Event';

export default class Ready extends Event {
    override async run() {
        const commands: {
            name: string;
            description: string;
            options: ToAPIApplicationCommandOptions[];
            default_permission: boolean | undefined;
            default_member_permissions: string | null | undefined;
            dm_permission: boolean | undefined;
        }[] = [];
        this.client.commands.forEach((command) => {
            commands.push(command.formatAPI());
        });
        this.client.contexts.forEach((context) => {
            commands.push(context.formatAPI());
        });
        await this.client.commandRegistry.registerCommands(commands);
        await this.client.logger.info(
            `[✓] ${this.client.user?.username} ready to serve [${this.client.users.cache.size}] users in [${
                this.client.guilds.cache.size
            }] server${this.client.guilds.cache.size > 1 ? 's' : ''}.`,
        );
    }
}
