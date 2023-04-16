// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default {
    token: process.env.token,
    clientId: process.env.client_id,
    ownerId: process.env.owner_id,
    serverId: process.env.server_id,
    dbUser: process.env.db_username,
    dbPassword: process.env.db_password,
    debug: true,
};
