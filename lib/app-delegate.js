var fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    TransformDelegate = require('./transform');

module.exports = (function() {
  var delegate = {};

  delegate.transform = function(file, opts) {
    if (!fs.existsSync(file)){
         console.error('[Error] AppDelegate file not found: ', file);
         process.exit(1);
    }

    var fileType = 'object-c';
    if (path.extname(file) === '.swift') {
      fileType = 'swift';
    }

    if (opts.add) {
      console.log('Adding the Rainforest.framework in the %s file ...', path.basename(file));
    } else {
      console.log('Removing the Rainforest.framework from the %s file ...', path.basename(file));
    }

    var ts = new TransformDelegate(fileType, opts);
    var rs = fs.createReadStream(file, 'utf8');
    var ws = fs.createWriteStream(file + '.new');

    rs.pipe(ts).pipe(ws);

    ws.on('finish', function() {
      if (ts.error) {
        shell.rm('-rf', file + '.new ');
        process.exit(1);
      } else {
        shell.mv(file + '.new ', file);
        console.log('%s file successfully updated.', path.basename(file));
        process.exit(0);
      }
    });
  };

  return delegate;
}());
