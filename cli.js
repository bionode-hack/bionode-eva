var eva = require('./index.js');
var commandLineArgs = require('command-line-args');
var optionDefinitions = require('./optionDefinitions');

// define the args we accept
var options = commandLineArgs(optionDefinitions);

eva(options, true);
