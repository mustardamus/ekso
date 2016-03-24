'use strict'

let ekso = require('../lib')
let assert = require('assert')

describe('initilization', () => {
  it('should export a function', () => {
    assert.equal(typeof ekso, 'function')
  })
})

describe('path definition by string', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs'
  }, [
    'byString',
    'coffeeScript',
    'deep/directory'
  ])

  it('should process string declaration', () => {
    assert.equal(obj.byString.boolean, true)
    assert.equal(obj.byString.object.works, true)
    assert.equal(obj.byString.array[0], true)
    assert.equal(obj.byString.function(true)[0], true)
  })

  it('should process coffee script files', () => {
    assert.equal(obj.coffeeScript.boolean, true)
  })

  it('should process deep directories', () => {
    assert.equal(obj.deep.directory.boolean, true)
    assert.equal(obj.deep.directory.works.object.works, true)
    assert.equal(obj.deep.directory.works.array[0], true)
    assert.equal(obj.deep.directory.works.function(true)[0], true)
  })
})

describe('entire directory with set rootDir', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs'
  })

  it('should process string declaration', () => {
    assert.equal(obj.byString.boolean, true)
  })

  it('should process coffee script files', () => {
    assert.equal(obj.coffeeScript.boolean, true)
  })

  it('should process deep directories', () => {
    assert.equal(obj.deep.directory.boolean, true)
  })
})

describe('entire working directory without options or dirs', () => {
  let obj = ekso()

  it('should have excluded node_modules by default', () => {
    assert.equal(typeof obj['node_modules'], 'undefined')
  })

  it('should have required the test boolean', () => {
    assert.equal(obj.test.dirs.deep.directory.boolean, true)
  })
})

describe('handling all functions', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs',
    executeFuncs: true,
    funcArgs: [true, true],
    funcContext: true
  })

  it('should execute all functions with given arguments', () => {
    assert.equal(obj.byString.function[0], true)
    assert.equal(obj.deep.directory.works.function[0], true)
  })

  it('should have the given context', () => {
    assert.equal(obj.byString.function[2], true)
    assert.equal(obj.deep.directory.works.function[2], true)
  })
})

describe('path definitions by objects', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs'
  }, [
    { path: 'byString' },
    { path: 'coffeeScript' },
    { path: 'deep/directory' }
  ])

  it('should process path declaration', () => {
    assert.equal(obj.byString.boolean, true)
  })

  it('should process coffee script files', () => {
    assert.equal(obj.coffeeScript.boolean, true)
  })

  it('should process deep directories', () => {
    assert.equal(obj.deep.directory.boolean, true)
  })
})

describe('path definition by object with executed functions', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs'
  }, [
    { path: 'byString' },
    {
      path: 'deep/directory',
      executeFuncs: true,
      funcArgs: [true, true],
      funcContext: true
    }
  ])

  it('should not have executed the functions if option not set', () => {
    assert.equal(obj.byString.function(true)[0], true)
  })

  it('should have executed functions with args if option set', () => {
    assert.equal(obj.deep.directory.works.function[0], true)
  })

  it('should have the given context if option set', () => {
    assert.equal(typeof obj.byString.function[2], 'undefined')
    assert.equal(obj.deep.directory.works.function[2], true)
  })
})

describe('path definition by object with global name transforms', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    nameTransforms: ['snakeCase', 'upperCase']
  })

  it('should process multiple transforms on the name', () => {
    assert.equal(obj.camelCase.CAMEL_CASE, true)
  })
})
