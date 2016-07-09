#!/usr/bin/env node
var request = require('request');
var url = require('url');
var JSONStream = require('jsonstream');
var split = require('split2');
var through = require('through2');
var commandLineArgs = require('command-line-args');
var miss = require('mississippi');
var optionDefinitions = require('./optionDefinitions');

// define the args we accept
var options = commandLineArgs(optionDefinitions);

var apiPath;

// check the args
if (options.path) {
  if (options.path.indexOf('?') !== -1) {
    var temp = options.path.split('?');
    options.path = temp[0];
    options.filters = temp[1];
  }
  apiPath = options.path;
} else {
  // if no args are used, default to /meta/studies/all
  if (!options.category && !options.ids && !options.resource && !options.filters) {
    options.category = 'meta';
    options.ids = 'studies';
    options.resource = 'all';
  } else if (!options.category) {
    console.error('Please provide a category');
  } else if (!options.ids) {
    console.error('Please provide IDs');
  } else {
    apiPath = options.category + '/' + options.ids + '/' + options.resource;
  }
}


var urlObject = {
  protocol: 'http',
  host: 'www.ebi.ac.uk',
  pathname: '/eva/webservices/rest/v1/' + apiPath,
  search: options.filters
};

var urlString = url.format(urlObject);

// example custom filter
var myFilter = through.obj(filter);
function filter(object, enc, next) {
  this.push(JSON.stringify(object));
  next();
}

// make the request
miss.pipe(request(urlString), split(), JSONStream.parse(), myFilter, process.stdout, function (err) {
  if (err) return console.error('ERROR: Please provide correct arguments \n', err)
});
