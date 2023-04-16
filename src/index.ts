import Client from './structures/Client';
import Database from './utils/Database';
const bot = new Client();

(async () => {
    bot.database = await Database(bot);
    bot.database.query('SELECT * FROM `users`',
        function (err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(fields); // fields contains extra meta data about results, if available
        })
    await bot.login(bot.config.token);
})();
