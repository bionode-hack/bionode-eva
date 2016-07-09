var request = require('request');
var url = require('url');
var JSONStream = require('jsonstream');
var split = require('split2');
var through = require('through2');

var urlObject = {
  protocol: 'http',
  host: 'www.ebi.ac.uk',
  pathname: '/eva/webservices/rest/v1/meta/studies/list',
  search: '?species=hsapiens_grch37'
};

var urlString = url.format(urlObject);

var myFilter = through.obj(filter);

function filter(object, enc, next) {
  this.push(JSON.stringify(object));
  next();
}

request(urlString)
.pipe(split())
.pipe(JSONStream.parse())
.pipe(myFilter)
.pipe(process.stdout);
