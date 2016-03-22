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
    assert.equal(obj.byString.function(), true)
  })

  it('should process coffee script files', () => {
    assert.equal(obj.coffeeScript.boolean, true)
  })

  it('should process deep directories', () => {
    assert.equal(obj.deep.directory.boolean, true)
    assert.equal(obj.deep.directory.works.object.works, true)
    assert.equal(obj.deep.directory.works.array[0], true)
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
