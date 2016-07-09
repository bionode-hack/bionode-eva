var url = require('url');
var request = require('request'); 
var requestPromise = require('request-promise'); 
var JSONStream = require('JSONStream');
var split = require('split2');
var through = require('through2');

function getStudiesMetadata(taxonomies){
	var urlStudiesAll = {   
		protocol: 'http',   
		host: 'www.ebi.ac.uk',   
		pathname: '/eva/webservices/rest/v1/meta/studies/all'
	};

	requestPromise(url.format(urlStudiesAll))
		.then(function(data){
			var object = JSON.parse(data), 
				resultLength = object.response[0].result.length,
				results = object.response[0].result,
				i,
				studies = [],
				baseUrl = 'ftp://ftp.ebi.ac.uk/pub/databases/eva/';
			for (i = 0; i < resultLength; i++){
				if (taxonomies[results[i].taxonomyId]){
					studies.push({
						external_id: results[i].id,
						title: results[i].name,
						description: results[i].description,
						url: baseUrl + results[i].id + '/eva_normalised_files/',
						tech: results[i].platform
					});
				}
			}
			console.log(studies);
		});
}

var urlSpecies = {   
	protocol: 'http',   
	host: 'www.ebi.ac.uk',   
	pathname: '/eva/webservices/rest/v1/meta/species/list'
};

var taxonomies = {};

requestPromise(url.format(urlSpecies))
	.then(function(data){
		var object = JSON.parse(data),
			results = object.response[0].result,
			resultLength = results.length,
			i,
			taxonomies = {};
		for (i = 0; i < resultLength; i++) {
			taxonomies[results[i].taxonomyId] = results[i].taxonomyCode;
		}
		console.log(taxonomies);
		getStudiesMetadata(taxonomies);
	});
