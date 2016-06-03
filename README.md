# Ekso

Ekso is a little utility to `require` entire directory structures, modify the
naming and initilization, and spit out a `Object` for further usage. It supports
CoffeeScript out of the box.

It was developed exclusively while riding buses in Europe. Dude needs something
better to do than watching those stupid shows, right?

## Test === Docs

Ekso has full test coverage which also acts as documentation
(because I am a lazy brah). Run them via:

    npm test

## Features

* [path definition by string](test/test.js#L12)
* [entire directory with set rootDir](test/test.js#L45)
* [entire working directory without options or dirs](test/test.js#L67)
* [handling all functions](test/test.js#L79)
* [path definitions by objects](test/test.js#L98)
* [path definition by object with executed functions](test/test.js#L125)
* [overwrite global function options with locals](test/test.js#L152)
* [global name transforms](test/test.js#L183)
* [local name transforms](test/test.js#L195)
* [overwrite global name transforms with local](test/test.js#L250)
* [global path transforms](test/test.js#L273)
* [local path transforms](test/test.js#L286)
* [overwrite global with local path transforms](test/test.js#L317)
* [global name prefix](test/test.js#L340)
* [global name postfix](test/test.js#L352)
* [local name prefix and postfix](test/test.js#L364)
* [overwrite global with local name prefix and postfix](test/test.js#L404)
* [global path prefix](test/test.js#L438)
* [global path postfix](test/test.js#L450)
* [local path prefix and postfix](test/test.js#L462)
* [overwrite the global with local path prefix and postfix](test/test.js#L502)
* [global option to make object global](test/test.js#L536)
* [last part of the path to be global](test/test.js#L551)
* [global object by local definition](test/test.js#L568)
* [overwrite global global option with local](test/test.js#L592)
* [global last part of path by local definition](test/test.js#L615)
* [overwrite global last global option with local](test/test.js#L638)
* [global option for global objects by require](test/test.js#L661)n
