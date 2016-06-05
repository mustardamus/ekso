# Ekso

Ekso is a little utility to `require` entire directory structures, modify the
naming and initilization, and spit out an `Object` for further usage. It
supports CoffeeScript out of the box.

It was developed exclusively while riding buses in Italy and Spain. Dude needs
something better to do than watching those stupid shows, right?

## Installation

    npm install ekso

## Usage

    const ekso = require('ekso')

The simplest way to use Ekso is without any parameters. This will `require` the
entire working directory (`process.cwd()`) and ignores the directory
`node_modules` by default:

    const App = ekso()

If the first parameter is an `Object`, it will be treated as global options.
Without any following parameter the whole directory (`rootDir` option) is
required:

    const App = ekso({
      rootDir: __dirname
    })

If the first or second parameter is an `Array` (consisting of `String`'s or
`Object`'s), it will be treated as paths and/or options for specific directories
to `require`, relative to the `rootDir`:

    const App = ekso({
      rootDir: __dirname
    }, [
      'examples/mvc/config',          // simple path declaration by String
      {
        path: 'examples/mvc/models',  // path declaration in an Object
        globalLast: true              // with options for that specific path
      }
    ])

Or:

    const App = ekso([
      'examples/mvc/config',
      'examples/mvc/models',
      'examples/mvc/controllers'
    ])

## Example

Find a simple MVC structure in
[./examples/mvc/index.js](/examples/mvc/index.js).

## Overwriting Global Options with Local Options

There are various options to modify how directories and files are required
([see section below](#local-options)).

If you pass them as Global Options they will apply to every directory and file
that is required:

    const App = ekso({
      nameTransforms: ['upperCase']   // transform every name to upperCase
    }, [
      'examples/mvc/config',          // names will be upperCase
      'examples/mvc/models'           // names will be upperCase
    ])

However, you can overwrite Global Options with Local Options if you pass the
path definitions as `Object`'s:

    const App = ekso({
      nameTransforms: ['upperCase']   // transform every name to upperCase
    }, [
      'examples/mvc/config',          // names will be upperCase
      {
        path: 'examples/mvc/models',
        nameTransforms: ['kebabCase'] // names will be kebabCase instead of upperCase
      }
    ])

## Global Options

These options can only be used in the global context, ie the first parameter you
pass to `ekso`, which is an `Object`.

### rootDir (`String`)

Default: `process.cwd()`. The path of the root directory. Without any further
path definitions the whole directory is required. If you specify paths, then
they are relative to the root directory.

### excludeDirs (`Array`)

Default: `['node_modules']`. Directories in this `Array` will not be processed,
either you `require` the whole root directory or specific paths.

### globalRequire (`Object`)

Default: `{}`. This will globally require every value in the `Object` as the key
name. This happens before paths are processed, so globally required modules will
be accessible in every file. Define it like so:

    const App = ekso({
      globalRequire: {
        _: 'lodash',
        express: 'express'
      }
    })

## Local Options

These options either can be used as Global Options to apply to every processed
path, or as Local Option to be used only on specific paths.

### executeFuncs (`Boolean`)

Default: `false`. If a `Function` is exported, execute it. For example:

    module.exports = function () {
      console.log('one time initialized')
    }

### funcArgs (`Array`)

Default: `[]`. If a `Function` is exported, and the `executeFuncs` option is set
to `true`, pass the given `Array` as arguments. For example:

    const App = ekso([
      {
        path: 'examples/mvc/models',
        executeFuncs: true,
        funcArgs: ['one', 'two']
      }
    ])

And a example model file:

    module.exports = function (arg1, arg2) {
      console.log(arg1, arg2)  // 'one', 'two'
    }

### funcContext (`Mixed`)

Default: The executed function's context. This option will set the context for a
executed function. You can set it to whatever, a `String`, `Object` or
`Function`. It will be available to the executed function as `this`. For
example:

    const App = ekso([
      {
        path: 'examples/mvc/models',
        executeFuncs: true,
        funcContext: 'that'
      }
    ])

And a example model file:

    module.exports = function () {
      console.log(this)  // 'that'
    }

### nameTransforms (`Array`)

Default: `[]`. This will transform the last part of the path, ie the filename.
Multiple transform can be combined. For example:

    const App = ekso([
      {
        path: 'examples/mvc/controllers',
        nameTransforms: ['camelCase', 'capitalize']
      }
    ])

That would first transform the filename to `kebabCase` and then `capitalize` it.

For example, given there is a controller file `users_controller.js`, it would
result in the path `App.examples.mvc.controllers.UsersController`.

Built-in transforms are:

* `lowerCase`: `FILENAME` -> `filename`
* `upperCase`: `filename` -> `FILENAME`
* `snakeCase`: `file-name` -> `file_name`
* `camelCase`: `file-name` -> `fileName`
* `kebabCase`: `file_name` -> `file-name`
* `capitalize`: `filename` -> `Filename`

### pathTransforms (`Array`)

Default: `[]`. Just like the `nameTransforms` option, but it will apply every
defined transform to every part of the path, except the last one. For example:

    const App = ekso([
      {
        path: 'examples/mvc/helpers',
        pathTransforms: ['capitalize']
      }
    ])

That would result in the path `App.Examples.Mvc.Helpers.filename`.

### namePrefix (`String`)

Default: `''`. This will prefix a `String` to the last part of the path, ie the
filename. For example:

    const App = ekso([
      {
        path: 'examples/mvc/controllers',
        namePrefix: 'awesome_'
      }
    ])

For example, given there is a controller file `users_controller.js`, it would
result in the path `App.examples.mvc.controllers.awesome_users_controller`.

### namePostfix (`String`)

Default: `''`. Just like the `namePrefix` option, but the `String` is appended.

### pathPrefix (`String`)

Default: `''`. Just like the `namePrefix` option, but the `String` prefixed to
every part of the path, except the last one. For example:

    const App = ekso([
      {
        path: 'examples/mvc/helpers',
        pathPrefix: 'x_'
      }
    ])

That would result in the path `App.x_example.x_mvc.x_helpers.filename`.

### pathPostfix (`String`)

Default: `''`. Just like the `pathPrefix` option, but the `String` is appended.

### global (`Boolean`)

Default: `false`. This will make the path globally available. They say that you
shouldn't pollute the global namespace. But since you are a rebel anyway, do it
if it fits your need. Just be careful that you are not overwriting already
defined namespaces. For example:

    const App = ekso([
      {
        path: 'examples/mvc/helpers',
        global: true
      }
    ])

Now you could access the helpers via `App.examples.mvc.helpers` in the same
file, but also via `examples.mvc.helpers` from anywhere else.

### globalLast (`Boolean`)

Default: `false`. This option will make the last part of the path, ie the
filename global. Again, use with caution. For example:

    const App = ekso([
      {
        path: 'examples/mvc/models',
        globalLast: true
      }
    ])

Given that we have a model file `User.js`, you can access it in the same file
with `App.examples.mvc.models.User`, but also via `User` from anywhere else.

## Testing & Linting

All options are covered by tests. Run them with:

    npm test

To see if everything is linting just fine, run:

    npm run lint
