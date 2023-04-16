import Client from './structures/Client';
import Database from './utils/Database';
const bot = new Client();

(async () => {
    await bot.login(bot.config.token);
})();
