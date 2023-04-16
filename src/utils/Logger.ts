import { Logger as tsLog } from 'tslog';
const Logger = new tsLog({
    type: 'pretty',
    prettyLogTemplate: '{{rawIsoStr}} {{logLevelName}} ',
});

export default Logger;
