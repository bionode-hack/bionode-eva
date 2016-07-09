var url = require('url');

var request = require('request');

var JSONStream = require('JSONStream');
var studyID = process.argv[2];


function getStudySummary(studyID){

    var urlObject = {
        protocol: 'http',
        host: 'www.ebi.ac.uk',
        pathname: 'eva/webservices/rest/v1/studies/' + studyID + '/summary',
        search: '?species=hsapiens_grch37'
    };

    var urlString = url.format(urlObject);
    return request(urlString)
        .pipe(JSONStream.parse())

}

getStudySummary(studyID)
    .pipe(JSONStream.stringify())
    .pipe(process.stdout);
