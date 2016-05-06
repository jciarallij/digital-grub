var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8000, function() {
  console.log('Directory = ' + __dirname);
  console.log('*************************');
  console.log('** Digital Grub Project**');
  console.log('*************************');
  console.log('Listening on port 8000...');

});