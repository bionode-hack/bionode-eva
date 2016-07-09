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

// if no args are used, default to /meta/studies/all
if (!options.category && !options.ids && !options.resource && !options.filters) {
  options.category = 'meta';
  options.ids = 'studies';
  options.resource = 'all';
}

var apiPath = options.category + '/' + options.ids + '/' + options.resource;

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
  if (err) return console.error('ERROR:', err)
})
