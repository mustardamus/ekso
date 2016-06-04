# Ekso

Ekso is a little utility to `require` entire directory structures, modify the
naming and initilization, and spit out a `Object` for further usage. It supports
CoffeeScript out of the box.

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
`require`d:

    const App = ekso({
      rootDir: __dirname
    })

If the first or second parameter is an `Array` (consisting of `String`s or
`Object`s), it will be treated as paths and/or options for specific directories
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
      'examples/mvc/collections'
    ])
