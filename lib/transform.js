var Transform = require('stream').Transform,
    util = require('util'),
    config = require('./config');

module.exports = (function() {

  var TransformDelegate = function(fileType, opts) {
    Transform.call(this, {objectMode: true});
    this.chunkNumber = 0;
    this.error = false;

    if (fileType === 'swift') {
      this.statement = config.app_delegate_swift
    } else {
      this.statement = config.app_delegate_m
    }

    if (opts.add) {
      this.operation = 'add';
    } else {
      this.operation = 'remove';
    }
  };
  util.inherits(TransformDelegate, Transform);

  TransformDelegate.prototype._transform = function(chunk, encoding, done) {
    var chunkStr = chunk.toString('utf8');

    if (this.chunkNumber === 0) {
      if (this.operation === 'add') {
        if (chunkStr.indexOf(this.statement.import) === -1) {
          console.log('- Adding import statement');
          chunkStr = this.addImportStatement(chunkStr);
        } else {
          console.log('- Found import statement');
        }

        if (chunkStr.indexOf(this.statement.finishFunction) === -1) {
          console.log('[Error] %s not found', this.statement.finishFunction);
          this.error = true;
        } else {
          console.log('- Found %s statement', this.statement.finishFunction);
          if (chunkStr.indexOf(this.statement.dispatch) === -1) {
            console.log('- Adding the dispatch statement in the %s', this.statement.finishFunction);
            chunkStr = this.addDispatchStatement(chunkStr);
          } else {
            console.log('- Found the dispatch statement');
          }
        }
      } else {  // remove
        if (chunkStr.indexOf(this.statement.import) === -1) {
          console.log('- Import statement not found');
        } else {
          console.log('- Removing import statement');
          chunkStr = this.removeImportStatement(chunkStr);
        }

        if (chunkStr.indexOf(this.statement.finishFunction) === -1) {
          console.log('- %s not found', this.statement.finishFunction);
        } else {
          console.log('- Found %s statement', this.statement.finishFunction);
          if (chunkStr.indexOf(this.statement.dispatch) === -1) {
            console.log('- Dispatch statement not found');
          } else {
            console.log('- Removing the dispatch statement');
            chunkStr = this.removeDispatchStatement(chunkStr);
          }
        }
      }
    }

    this.push(new Buffer(chunkStr, 'utf8'));

    this.chunkNumber++;
    done();
  };

  TransformDelegate.prototype.addImportStatement = function(chunkStr) {
    var tmpStr = this.statement.import + "\n";
    tmpStr += chunkStr;
    chunkStr = tmpStr;
    return chunkStr;
  };

  TransformDelegate.prototype.removeImportStatement = function(chunkStr) {
    return chunkStr.replace(this.statement.import, '');
  };

  TransformDelegate.prototype.addDispatchStatement = function(chunkStr) {
    var startIndex = chunkStr.indexOf(this.statement.finishFunction);
    var tmpString = chunkStr.substr(startIndex);
    var firstBraceIndex = tmpString.indexOf("{");
    if (firstBraceIndex !== -1) {
      chunkStr = chunkStr.slice(0, startIndex) + tmpString.slice(0, firstBraceIndex + 1) +
                 this.statement.dispatch + tmpString.slice(firstBraceIndex + 1);
    } else {
      console.log('[Error] Error on adding the dispatch statement: Open braces not found.');
      this.error = true;
    }
    return chunkStr;
  };

  TransformDelegate.prototype.removeDispatchStatement = function(chunkStr) {
    return chunkStr.replace(this.statement.dispatch, '');
  };

  return TransformDelegate;
}());
