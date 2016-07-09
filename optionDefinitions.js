// define which CLI args we accept
const optionDefinitions = [
  {name: 'category', alias: 'c', type: String},
  {name: 'ids', alias: 'i', type: String},
  {name: 'resource', alias: 'r', type: String, defaultValue: ''},
  {name: 'filters', alias: 'f', type: String, defaultValue: ''},
  {name: 'path', alias: 'p', type: String}
];

module.exports = optionDefinitions;
