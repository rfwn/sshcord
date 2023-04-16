import { CommandInteraction, SlashCommandBuilder, ToAPIApplicationCommandOptions } from 'discord.js';

import Client from './Client';

interface ICommandOptions {
    whitelist?: boolean;
}

class Commamd {
    /**
     * The command name
     */
    public readonly name: string;

    /**
     * The command description
     */
    public readonly description: string;

    /**
     * The options for the command
     */
    public readonly options: ToAPIApplicationCommandOptions[];

    /**
     * The client that this command belongs to.
     */
    public readonly client: Client;

    /**
     * is whitelistable?
     */
    public whitelist: boolean;

    private readonly _command;

    default_permission: boolean | undefined;
    default_member_permissions: string | null | undefined;
    dm_permission: boolean | undefined;

    constructor(
        options: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
        client: Client,
        commandOptions: ICommandOptions,
    ) {
        this.name = options.name;
        this.client = client;
        this.description = options.description;
        this.options = options.options;
        this.default_permission = options.default_permission;
        this.default_member_permissions = options.default_member_permissions;
        this.dm_permission = options.dm_permission;
        this.whitelist = commandOptions.whitelist || false;
        this._command = this.safeRun.bind(this);
    }

    private async safeRun(interaction: CommandInteraction): Promise<any> {
        try {
            return await this.run(interaction);
        } catch (error) {
            this.client.logger.error(new Error(`Event ${this.name} failed to execute.`));
        }
    }

    // eslint-disable-next-line
    public async run(_interaction: CommandInteraction): Promise<any> {}

    public formatAPI() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            default_permission: this.default_permission,
            default_member_permissions: this.default_member_permissions,
            dm_permission: this.dm_permission,
        };
    }
}

export default Commamd;
