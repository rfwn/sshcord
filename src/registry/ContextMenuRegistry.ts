import Client from '../structures/Client';
import { promisify } from 'util';
import fs from 'fs';
const readdir = promisify(fs.readdir);

export default class ContextMenuRegistry {
    private client: Client;
    private _dir = './dist/contexts/';

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Loads all commands from the commands directory and starts listening for them.
     * @returns {Promise<void>}
     */
    public async loadContexts(): Promise<void> {
        const contextFiles = await readdir(this._dir);
        this.client.logger.info('=-=-=-=-=-=-=- Loading Context Menus -=-=-=-=-=-=-=');
        let contextsLoaded = 0;
        contextFiles.forEach(async (contextFile) => {
            delete require.cache[contextFile];
            try {
                const contextClass = await import(`../contexts/${contextFile}`);
                const context = new contextClass.default(this.client, contextFile.split('.js')[0]);
                contextsLoaded++;
                this.client.logger.info(`[${contextsLoaded}] ContextMenu ${contextFile.split('.js')[0]} loaded.`);
                this.client.contexts.set(context.name, context);
                return;
            } catch (err) {
                this.client.logger.error(err);
            }
        });
    }
}
