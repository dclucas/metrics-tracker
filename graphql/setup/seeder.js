const payloads = require('./data');
const factory = require('../app/factory');
const config = factory.resolveConfig();
const logger = factory.resolveLogger();
const uploader = require('./uploader');

uploader
    .createUploader(config, logger, payloads)
    .upload()
    .then(res => {
        logger.info('done uploading');
        process.exit(0);
    })
    .catch(err => {
        logger.fatal(err);
        process.exit(1);
    });