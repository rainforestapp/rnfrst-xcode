module.exports = (function() {

  var config = {};

  config.app_delegate_m = {
    import : '#import <Rainforest/Rainforest.h>',
    finishFunction : 'didFinishLaunchingWithOptions'
  };

  config.app_delegate_m.dispatch = '\n' +
    'dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{\n' +
    '    [[Rainforest shared] bootstrap];\n' +
    '});\n';

  config.app_delegate_swift = {
    import : 'import Rainforest',
    finishFunction : 'didFinishLaunchingWithOptions'
  };

  config.app_delegate_swift.dispatch = '\n' +
    'dispatch_after(dispatch_time(DISPATCH_TIME_NOW, Int64(1 * Double(NSEC_PER_SEC))), dispatch_get_main_queue()) {\n' +
    '    let shared = Rainforest.shared()\n' +
    '    shared.bootstrap()\n' +
    '}\n';

  return config;

}());
