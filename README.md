# rnfrst-xcode

CLI to help on the insertion and removal of the Rainforest.framework on iOS apps.

More details about how to download the framework and how to start testing your iOS app with [Rainforest QA](http://www.rainforestqa.com) can be found at our [support page](http://support.rainforestqa.com/hc/en-us/articles/222170227-Testing-your-Native-iOS-Applications).

## Installation

Please make sure you have [nodejs](nodejs.org) installed on your computer.

```
npm install -g rnfrst-xcode
```

## Usage

```
$ rnfrst-xcode --help

  Usage: rnfrst-xcode [options] [command]

  Commands:

    add [options]            add a framework as embedded binary in a iOS xcode project
    rm [options]             remove a framework from a iOS xcode project
    app-delegate [options]   add or remove the Rainforest.framework calls from the AppDelegate file

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Example:

    $ rnfrst-xcode add --xcodeproj <path> --file <path>
    $ rnfrst-xcode rm --xcodeproj <path> --file <path>
    $ rnfrst-xcode app-delegate --add --file <path>
    $ rnfrst-xcode app-delegate --rm --file <path>
```

### Adding the framework to a Xcode project

To add the framework into your Xcode project you need to specify to the `rnfrst-xcode add` command the path to your `.xcodeproj` file together with the path to the `Rainforest.framework`. Example:

```
rnfrst-xcode add --xcodeproj <path_to_xcodeproj> --file <path_to_framework>
```

After add the framework, please, verify if your app still working correctly before try to use it on Rainforest QA.

You can call `rnfrst-xcode add --help` to get more details about this command.

### Removing the framework from a Xcode project

If you have used the `rnfrst-xcode add` command to add the framework in your project, you can remove it by passing the location inside of your Xcode project where the `Rainforest.framework` was copied:

```
rnfrst-xcode rm --xcodeproj <path_to_xcodeproj> --file <path_to_framework>
```

Please, type `rnfrst-xcode rm --help` for more details.

### Updating the AppDelegate file

It's possible to use the CLI to include in your AppDelegate file the calls to start the `Rainforest.framework`:

```
rnfrst-xcode app-delegate --add --file <path_to_app_delegate>
```

You can also remove the calls to start the framework if they were added by the CLI:

```
rnfrst-xcode app-delegate --rm --file <path_to_app_delegate>
```

Check the `rnfrst-xcode app-delegate --help` output for more details.

## Compatibility

Tested with Xcode 7.3.

## Contributing
1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request
