import Client from './structures/Client';
import Database from './utils/Database';
const bot = new Client();

(async () => {
    bot.database = await Database(bot);
    await bot.login(bot.config.token);
})();
