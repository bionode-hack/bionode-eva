var request = require('request');
var url = require('url');
var JSONStream = require('jsonstream');
var split = require('split2');
var through = require('through2');
var commandLineArgs = require('command-line-args');
var optionDefinitions = require('./optionDefinitions');

var options = commandLineArgs(optionDefinitions);

// validations
// if (!options.resource) {
//   console.error('Please provide a resource');
// } else {
//   go();
// }

var apiPath = options.category + '/' + options.ids + '/' + options.resource;

var urlObject = {
  protocol: 'http',
  host: 'www.ebi.ac.uk',
  pathname: '/eva/webservices/rest/v1/' + apiPath,
  search: options.fields
};

var urlString = url.format(urlObject);
console.log('url', urlString, options);

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
