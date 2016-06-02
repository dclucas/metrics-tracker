const 
    _ = require('lodash'),
    uuid = require('node-uuid'),
    mapper = require('./general-mapper');

module.exports = {
    mapComponentAttributes: function(reportItem) {
        return { 
            key: reportItem.id,
            type: reportItem.keyword,
            uri: reportItem.uri,
            name: reportItem.name,
            description: reportItem.description,
            subcomponents: reportItem.elements? _.map(reportItem.elements, this.mapComponentAttributes) : undefined
        };
    },
    
    mapComponent: function(reportItem, subjectId, rootId) {
        return { 
            _id: uuid.v4(), 
            type: 'component', 
            attributes: this.mapComponentAttributes(reportItem),
            relationships: {
                subject: { data: { type: 'subjects', id: subjectId } },
                parent: rootId? {} : undefined
            } 
        };
    },
    
     mapComponentTree: function(reportItem, subjectId) {
        var rootId = uuid.v4();
        return _.concat(
            _.map(reportItem.elements, (r) => this.mapComponent(r, subjectId, rootId)),
            this.mapComponent(reportItem, subjectId));
    },
    
    mapCucumber: function(cucumberPayload) {
        const attr = cucumberPayload.data.attributes;
        const subject = mapper.mapResource('subjects', attr.subjectKey);
        const assessment = mapper.mapResource('assessments', attr.assessmentKey, [{name: 'subject', type: 'subjects', id: subject._id}]);
        const exam = mapper.mapResource('exams', attr.examKey, [{name: 'assessment', type: 'assessments', id: assessment._id}]);
        return {
            subject: subject,
            assessment: assessment,
            exam: exam,
            components: _.flatMap(attr.report, (r) => this.mapComponentTree(r, subject._id))
        }
    }    
};
