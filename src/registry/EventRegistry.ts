import Client from '../structures/Client';
import { promisify } from 'util';
import fs from 'fs';

const readdir = promisify(fs.readdir);

export default class EventRegistry {
    private client: Client;
    private _dir = './dist/events/';

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Loads all events from the events directory and starts listening for them.
     * @returns {Promise<void>}
     */
    public async loadEvents(): Promise<void> {
        const eventFolders = await readdir(this._dir);
        this.client.logger.info('=-=-=-=-=-=-=- Loading events -=-=-=-=-=-=-=');
        let eventsLoaded = 0;
        eventFolders.forEach(async (folder) => {
            const eventFiles = await readdir(this._dir + folder + '/');
            eventFiles.forEach(async (eventFile) => {
                delete require.cache[eventFile];
                try {
                    const eventClass = await import(`../events/${folder}/${eventFile}`);
                    const event = new eventClass.default(this.client, eventFile.split('.js')[0]);
                    event.listen();
                    eventsLoaded++;
                    this.client.logger.info(`[${eventsLoaded}] Event ${eventFile.split('.js')[0]} loaded.`);
                    return this.client.events.set(event.name, event);
                } catch (err) {
                    this.client.logger.error(err);
                }
            });
        });
    }

    /**
     * Unloads all events from the events directory and stops listening for them.
     * @returns {Promise<void>}
     */
    public unloadEvents(): void {
        this.client.events.forEach((event) => event.turnOff());
    }

    /**
     * Reloads all of the events.
     */
    public reloadEvents(): void {
        this.unloadEvents();
        this.loadEvents();
    }
}
