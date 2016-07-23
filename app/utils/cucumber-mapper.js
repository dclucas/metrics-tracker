const 
    _ = require('lodash'),
    uuid = require('node-uuid'),
    mapper = require('./general-mapper');

module.exports = {
    mapStep: function (step, componentId) {
        // todo: consider a new endpoint (checks)
        // for these pass/fail situations
        return {
            _id: uuid.v4(),
            type: 'checks',
            attributes: {
                type: 'cucumber-step',
                status: step.result.status,
                duration: step.result.duration,
                details: step.name
            },
            relationships: {
                component: {
                    data: {
                        type: 'components',
                        id: componentId
                    }
                }
            }
        }    
    },
    
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
        const id = uuid.v4();
        return { 
            component: { 
                _id: id, 
                type: 'component', 
                attributes: this.mapComponentAttributes(reportItem),
                relationships: {
                    subject: { data: { type: 'subjects', id: subjectId } },
                    parent: rootId? {} : undefined
                } 
            },
            steps: _.map(reportItem.steps, (r) => this.mapStep(r, id))
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
        const nestedCols = _.flatMap(attr.report, (r) => this.mapComponentTree(r, subject._id));
        return {
            subject: subject,
            assessment: assessment,
            exam: exam,
            components: _.map(nestedCols, (x) => x.component),
            checks: _.flatMap(nestedCols, (x) => x.steps)
        }
    }    
};
