var eva = require('./index');

var stream = eva({
  path: 'meta/studies/count'
});

stream.on('data', function(data) {
  console.log('data', data);
});

stream.on('finish', function() {
  console.log('finish');
});
