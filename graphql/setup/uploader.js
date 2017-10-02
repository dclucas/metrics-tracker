const payloads = require('./data');
const { MongoClient } = require('mongodb');
const { propOr, keys, map, forEach } = require('ramda');

module.exports.createUploader = (config, logger) => ({    
    upload: async () => {
        const uploadCollection = async (col) => {
            const colData = payloads[col];
            return await Promise.all(
                map(entry =>
                    db.collection(col).update({_id: entry._id}, entry, { upsert: true })
                , colData)
            );
        };
            
        logger.info('uploading data...');
        const db = await MongoClient.connect(config.mongodbUrl);
        return Promise.all(map(uploadCollection, keys(payloads)));
        const col = 'subjects';
        return uploadCollection(col);
    }
})
