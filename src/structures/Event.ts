// Dependencies
import Client from './Client';
import { ClientEvents } from 'discord.js';

class Event {
    /**
     * The name of the event
     */
    public readonly name: keyof ClientEvents;

    /**
     * The bot's client
     */
    public readonly client: Client;

    private readonly _event;

    constructor(client: Client, name: keyof ClientEvents) {
        this.name = name;
        this.client = client;
        this._event = this.safeRun.bind(this);
    }

    private async safeRun(...args: any) {
        try {
            return await this.run(...args);
        } catch (error) {
            this.client.logger.error(new Error(`Event ${this.name} failed to execute.`));
        }
    }

    /**
     * Execute the event.
     * @param _args The arguments for our event.
     */
    // eslint-disable-next-line
    public async run(..._args: any): Promise<any> {}

    /**
     * Listen for our event.
     */
    public listen() {
        return this.client.on(this.name, this._event);
    }

    /**
     * Stop listening for our event.
     */
    public turnOff() {
        return this.client.off(this.name, this._event);
    }
}

export default Event;
