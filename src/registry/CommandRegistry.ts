import Client from '../structures/Client';
import { promisify } from 'util';
import fs from 'fs';
const readdir = promisify(fs.readdir);
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';

export default class CommandRegistry {
    private client: Client;
    private _dir = './dist/commands/';

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Loads all commands from the commands directory and starts listening for them.
     * @returns {Promise<void>}
     */
    public async loadCommands(): Promise<void> {
        const commandFolders = await readdir(this._dir);
        this.client.logger.info('=-=-=-=-=-=-=- Loading Commands -=-=-=-=-=-=-=');
        let commandsLoaded = 0;
        commandFolders.forEach(async (folder) => {
            const commandFiles = await readdir(this._dir + folder + '/');
            commandFiles.forEach(async (commandFile) => {
                delete require.cache[commandFile];
                try {
                    const commandClass = await import(`../commands/${folder}/${commandFile}`);
                    const command = new commandClass.default(this.client, commandFile.split('.js')[0]);
                    commandsLoaded++;
                    this.client.logger.info(`[${commandsLoaded}] Command ${commandFile.split('.js')[0]} loaded.`);
                    this.client.commands.set(command.name, command);
                    return;
                } catch (err) {
                    this.client.logger.error(err);
                }
            });
        });
    }

    public async registerCommands(commands: any) {
        const rest = new REST({ version: '10' }).setToken(this.client.config.token!);

        try {
            this.client.logger.info('[/] Started refreshing application commands.');

            await rest.put(
                Routes.applicationGuildCommands(this.client.config.clientId!, this.client.config.serverId!),
                {
                    body: commands,
                },
            );

            this.client.logger.info('[/] Successfully reloaded application commands.');
        } catch (error) {
            console.error(error);
        }
    }
}
