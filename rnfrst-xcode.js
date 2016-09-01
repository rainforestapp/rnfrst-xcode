#!/usr/bin/env node
'use strict';

var program = require('commander');

var delegate = require('./lib/app-delegate'),
    xcode = require('./lib/xcode-exec');

program.version('0.0.1')
  .on('--help', function() {
    console.log('  Example:');
    console.log();
    console.log('    $ rnfrst-xcode add --xcodeproj <path> --file <path>');
    console.log('    $ rnfrst-xcode rm --xcodeproj <path> --file <path>');
    console.log('    $ rnfrst-xcode app-delegate --add --file <path>');
    console.log('    $ rnfrst-xcode app-delegate --rm --file <path>');
    console.log();
  });

program.command('*')
  .action(function(options){
    program.outputHelp();
    process.exit(2);
  });

program.command('add')
  .description('add a framework as embedded binary in a iOS xcode project')
  .option("-x, --xcodeproj [path]", "Path to the .xcodeprof file")
  .option("-f, --file [path]", "Path to the Rainforest.framework file")
  .action(function(options){
    var error = false;
    ['xcodeproj', 'file'].forEach(function(op) {
      if (!options[op]) {
        console.error('[Error] --%s option not specified.', op);
        error = true;
      }
    })
    if (error) {
      this.outputHelp();
      process.exit(2);
    }
    xcode.addFramework(options.xcodeproj, options.file);
  }).on('--help', function() {
    console.log('  Example:');
    console.log();
    console.log('    $ rnfrst-xcode add --xcodeproj <path> --file <path>');
    console.log();
  });

program.command('rm')
  .description('remove a framework from a iOS xcode project')
  .option("-x, --xcodeproj [path]", "Path to the .xcodeprof file")
  .option("-f, --file [path]", "Path to the Rainforest.framework file inside the xcode project")
  .action(function(options){
    var error = false;
    ['xcodeproj', 'file'].forEach(function(op) {
      if (!options[op]) {
        console.error('[Error] --%s option not specified.', op);
        error = true;
      }
    })
    if (error) {
      this.outputHelp();
      process.exit(2);
    }
    xcode.removeFramework(options.xcodeproj, options.file);
  }).on('--help', function() {
    console.log('  Example:');
    console.log();
    console.log('    $ rnfrst-xcode rm --xcodeproj <path> --file <path>');
    console.log();
  });

program.command('app-delegate')
  .description('add or remove the Rainforest.framework calls from the AppDelegate file')
  .option("-a, --add", "Add the Rainforest.framework to the AppDelegate file")
  .option("-r, --rm", "Remove the Rainforest.framework from the AppDelegate file")
  .option("-f, --file [path]", "Path to the AppDelegate file")
  .action(function(options){
    var error = false;
    ['file'].forEach(function(op) {
      if (!options[op]) {
        console.error('[Error] --%s option not specified.', op);
        error = true;
      }
    })
    if (error) {
      this.outputHelp();
      process.exit(2);
    }
    if (options.add) {
      delegate.transform(options.file, {add: true});
    } else if (options.rm) {
      delegate.transform(options.file, {add: false});
    } else {
      console.error('[Error] --add or --rm options should be specified.');
      process.exit(2);
    }
  }).on('--help', function() {
    console.log('  Example:');
    console.log();
    console.log('    $ rnfrst-xcode app-delegate --add --file <path>');
    console.log('    $ rnfrst-xcode app-delegate --rm --file <path>');
    console.log();
  });

program.parse(process.argv);

if(program.args.length === 0 ) {
  program.outputHelp();
  process.exit(2);
}
