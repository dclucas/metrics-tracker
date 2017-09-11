const factory = require('./app/factory');

const app = factory.resolveApp();
const { port } = factory.resolveConfig();

app.listen(port);