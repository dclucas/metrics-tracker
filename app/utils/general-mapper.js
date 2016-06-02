const 
    uuid = require('node-uuid');

module.exports = {        
    mapResource: function(collectionName, key, relationships) {
        return { 
            _id: uuid.v4(), 
            type: collectionName, 
            attributes: { key: key },
            relationships: relationships?
                _.reduce(
                    relationships, 
                    (p, r) => { 
                        p[r.name] = { data: { type: r.type, id: r.id } };
                        return p; 
                    },
                    {}
                )
                : undefined
        };
    }      
};
