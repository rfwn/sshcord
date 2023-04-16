// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default {
    token: process.env.token,
    clientId: process.env.client_id,
    ownerId: process.env.owner_id,
    serverId: process.env.server_id,
    debug: true,
};
