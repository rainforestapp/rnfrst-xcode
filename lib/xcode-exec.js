var xcode = require('xcode'),
    shell = require('shelljs'),
    fs = require('fs'),
    path = require('path');

module.exports = (function() {
  var exec = {};

  exec.addFramework =  function(xcodeproj, file) {
    const projectPath = xcodeproj + '/project.pbxproj';
    if (!fs.existsSync(projectPath)){
         console.error('[Error] pbxproj file not found: ', projectPath);
         process.exit(1);
    }
    if (!fs.existsSync(file)){
         console.error('[Error] framework file not found: ', file);
         process.exit(1);
    }

    var myProj = xcode.project(projectPath);
    myProj.parseSync();

    var frameworkGroup = myProj.pbxGroupByName('Frameworks')
    if (!frameworkGroup) {
      console.log('Creating the Frameworks group ...');
      var groupKey = myProj.pbxCreateGroup('Frameworks', 'Frameworks');
      var group = myProj.getPBXGroupByKey(groupKey);
      delete group.path; // removing path
      // adding Frameworks group to the mainGroup
      var mainGroup = myProj.pbxProjectSection()[myProj.getFirstProject()['uuid']]['mainGroup'];
      if (mainGroup) {
        myProj.addToPbxGroup(groupKey, mainGroup, {});
      }
    }

    var framework = path.basename(file);
    console.log('Copying %s to the xcodeproj root directory ...', framework);
    shell.cp('-R', file, path.dirname(xcodeproj)); // frameworks are directories

    // Assuming first target is the app.
    var targetUUID = myProj.getFirstTarget().uuid;

    // Check to see if the Embed Framework node exists, if not, add it.
    if (!myProj.pbxEmbedFrameworksBuildPhaseObj(targetUUID)) {
        console.log('Creating the Embed Framework build phase ...');
        var buildPhaseResult = myProj.addBuildPhase([], "PBXCopyFilesBuildPhase", "Embed Frameworks", targetUUID,  "framework");
        buildPhaseResult.buildPhase.dstSubfolderSpec = 10;
    }

    var projectName = myProj.getFirstTarget().firstTarget.name
    console.log('Adding framework to the %s target ...', projectName);
    var pbxFile = myProj.addFramework(framework, {customFramework: true, target: targetUUID, embed: true, link: true, sign: true});

    // Writing changes
    fs.writeFileSync(projectPath, myProj.writeSync());
    console.log('%s successfully added to xcode project.', framework);
    process.exit(0);
  };

  exec.removeFramework = function(xcodeproj, file) {
    const projectPath = xcodeproj + '/project.pbxproj';
    if (!fs.existsSync(projectPath)){
         console.error('[Error] pbxproj file not found: ', projectPath);
         process.exit(1);
    }
    if (!fs.existsSync(file)){
         console.error('[Error] framework file not found: ', file);
         process.exit(1);
    }

    var myProj = xcode.project(projectPath);
    myProj.parseSync();

    var framework = path.basename(file);
    console.log('Removing %s from Frameworks ...', framework);
    var pbxFile = myProj.removeFramework(framework, {customFramework: true});
    if (pbxFile) {
        myProj.removeFromPbxEmbedFrameworksBuildPhase(pbxFile);
    }
    shell.rm('-rf', file);

    // Writing changes
    fs.writeFileSync(projectPath, myProj.writeSync());
    console.log('%s successfully removed from xcode project.', framework);
    process.exit(0);
  };

  return exec;
}());
