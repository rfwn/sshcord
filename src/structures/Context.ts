import { ContextMenuCommandBuilder, ContextMenuCommandInteraction, ContextMenuCommandType } from 'discord.js';
import Client from './Client';

class ContextMenu {
    /**
     * Name of the context command
     */
    public readonly name: string;
    /**
     * The type of this context menu command
     */
    public readonly type: ContextMenuCommandType;
    /**
     * Whether the command is enabled by default when the app is added to a guild
     *
     * @deprecated This property is deprecated and will be removed in the future.
     * You should use `setDefaultMemberPermissions` or `setDMPermission` instead.
     */
    public readonly default_permission: boolean | undefined;
    /**
     * Set of permissions represented as a bit set for the command
     */
    public readonly default_member_permissions: string | null | undefined;
    /**
     * Indicates whether the command is available in DMs with the application, only for globally-scoped commands.
     * By default, commands are visible.
     */
    public readonly dm_permission: boolean | undefined;

    /**
     * The client that this command belongs to.
     */
    public readonly client: Client;

    private readonly _context;
    constructor(options: ContextMenuCommandBuilder, client: Client) {
        this.name = options.name;
        this.client = client;
        this.type = options.type;
        this.default_permission = options.default_permission;
        this.default_member_permissions = options.default_member_permissions;
        this.dm_permission = options.dm_permission;
        this._context = this.safeRun.bind(this);
    }

    private async safeRun(interaction: ContextMenuCommandInteraction): Promise<any> {
        try {
            return await this.run(interaction);
        } catch (error) {
            this.client.logger.error(new Error(`Event ${this.name} failed to execute.`));
        }
    }
    // eslint-disable-next-line
    public async run(_interaction: ContextMenuCommandInteraction): Promise<any> {}

    public formatAPI() {
        return {
            name: this.name,
            type: this.type,
            default_permission: this.default_permission,
            default_member_permissions: this.default_member_permissions,
            dm_permission: this.dm_permission,
        };
    }
}

export default ContextMenu;
