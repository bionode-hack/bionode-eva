var url = require('url');
var request = require('request'); 
var requestPromise = require('request-promise'); 
var JSONStream = require('JSONStream');
var split = require('split2');
var through = require('through2');

function getIdsFromAllStudiesRequest (object, enc, next){
	var noResults = object.response[0].result.length,
		studiesResult = object.response[0].result,
		i = 0,
		studies = [];
	for (i = 0; i < noResults; i++){
		studies.push({
			external_id: studiesResult[i].id,
		});
	}
	this.push(studies);
	next();
};

function getStudiesMetadata(taxonomies){
	var getStudyIds = through.obj(getIdsFromAllStudiesRequest);
	var urlStudiesAll = {   
		protocol: 'http',   
		host: 'www.ebi.ac.uk',   
		pathname: '/eva/webservices/rest/v1/meta/studies/all'
	};

	request(url.format(urlStudiesAll))
			.pipe(split())
			.pipe(JSONStream.parse())
			.pipe(getStudyIds)
			.pipe(process.stdout);
}

var urlSpecies = {   
	protocol: 'http',   
	host: 'www.ebi.ac.uk',   
	pathname: '/eva/webservices/rest/v1/meta/species/list'
};

var taxonomies = {};

requestPromise(url.format(urlSpecies))
	.then(function(data){
		var results = object.response[0].result,
			resultLength = results.length,
			i,
			taxonomies = {};
		for (i = 0; i < resultLength; i++) {
			taxonomies[results[i].taxonomyId] = results[i].taxonomyCode;
		}
	});
