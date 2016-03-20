'use strict'

let ekso = require('../lib')
let assert = require('assert')

describe('initilization', () => {
  it('should export a function', () => {
    assert.equal(typeof ekso, 'function')
  })
})


ekso({
  rootDir: __dirname + '/dirs'
}, [
  'byString',
  'coffeeScript',
  {
    path: 'controllers',
    postfix: 'Controller',
    nameTransform: ['capitalize']
  }
])

describe('global variables', () => {
  it('should process string declaration', () => {
    assert.equal(byString.boolean, true)
  })

  it('should process coffee script files', () => {
    assert.equal(coffeeScript.boolean, true)
  })
})
