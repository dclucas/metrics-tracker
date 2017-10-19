const factory = require('./app/factory');

const app = factory.resolveApp();
const logger = factory.resolveLogger();

app.start()
    .then(() => logger.info('app started'));