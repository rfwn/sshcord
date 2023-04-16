import { Collection, EmbedBuilder } from 'discord.js';
import Client from '../structures/Client';

export class WebhookService {
    /**
		The embeds to send collection.
		@returns {Collection<string, EmbedBuilder>}
	*/
    private _collection: Collection<string, Array<EmbedBuilder>>;
    private _client: Client;

    constructor(client: Client) {
        this._client = client;
        this._collection = new Collection<string, Array<EmbedBuilder>>();
    }

    /**
     * Function for adding embeds to the webhook manager. (Stops API abuse)
     * @param {string} channelID The key to search up
     * @param {EmbedBuilder} embed The args for variables in the key
     */
    public addEmbed(channelId: string, embed: EmbedBuilder): void {
        if (!this._collection.has(channelId)) {
            this._collection.set(channelId, [embed]);
        } else {
            this._collection.set(channelId, [...(this._collection.get(channelId) || []), embed]);
        }
    }

    /**
     * Show all embeds in the webhook manager.
     */
    public getEmbeds(): Collection<string, Array<EmbedBuilder>> {
        return this._collection;
    }

    /**
     * Send all webhooks to their specefic channels.
     */
    public async sendWebhooks(): Promise<void> {
        const channelIds = Array.from(this._collection.keys());
        for (const channel of channelIds) {
            try {
                const webhooks = await this._client.channels.fetch(channel).then((c: any) => c.fetchWebhooks());
                let webhook = webhooks.find((wh: { name: string }) => wh.name == this._client.user!.username);

                if (!webhook) {
                    webhook = await this._client.channels.fetch(channel).then((c: any) =>
                        c.createWebhook(this._client.user!.username, {
                            avatar: this._client.user!.displayAvatarURL({ extension: 'png', size: 1024 }),
                        }),
                    );
                }

                const repeats = Math.ceil(this._collection.get(channel)!.length / 10);

                for (let j = 0; j < repeats; j++) {
                    const embeds = this._collection.get(channel)?.slice(j * 10, j * 10 + 10);
                    if (!embeds) return;
                    // console.log(embeds);
                    await webhook.send({
                        embeds: embeds,
                    });
                }
                this._collection.delete(channel);
            } catch (err) {
                this._client.logger.error(err);
                this._collection.delete(channel);
            }
        }
    }
}
