'use strict'

module.exports = function (server) {
    const
        adapter = server.plugins['hapi-harvester'].adapter;

    adapter.idempotentSave = (payload, collection, filter) => {
        const
            model = adapter.models[collection],
            query = model.findOne(filter || {"attributes.key": payload.attributes.key});    
        return query.exec()
        .then((doc) => {
            if (!doc) {
                // fixme: handle concurrent saves (multiple parallel calls might cause saves to be fired multiple times)
                return new model(payload).save();
            }
            return doc._doc;
        })
    }

    adapter.upsert = (payload) => 
        adapter.models[payload.data.type].findByIdAndUpdate(
            payload.data.id,
            payload,
            { upsert: true }
        );
}