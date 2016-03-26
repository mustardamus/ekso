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

describe('global name transforms', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    nameTransforms: ['snakeCase', 'upperCase']
  })

  it('should process multiple transforms on the name', () => {
    assert.equal(obj.snake_case.SNAKE_CASE, true)
    assert.equal(obj.camelCase.CAMEL_CASE, true)
  })
})

describe('global path transforms', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    pathTransforms: ['snakeCase', 'upperCase']
  })

  it('should process multiple transforms on the path', () => {
    assert.equal(obj.SNAKE_CASE.snake_case, true)
    assert.equal(obj.CAMEL_CASE.camelCase, true)
    assert.equal(obj.SNAKE_CASE.CAMEL_CASE.camelCase, true)
  })
})

describe('local name transforms', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms'
  }, [
    {
      path: 'camelCase',
      nameTransforms: ['snakeCase', 'upperCase']
    },
    {
      path: 'snake_case',
      nameTransforms: ['camelCase']
    },
    {
      path: 'lowercase',
      nameTransforms: ['upperCase']
    },
    {
      path: 'UPPERCASE',
      nameTransforms: ['lowerCase']
    },
    {
      path: 'kebab-case',
      nameTransforms: ['capitalize']
    },
    {
      path: 'justAnotherTest',
      nameTransforms: ['kebabCase']
    }
  ])

  it('should process snakeCase in combination with upperCase', () => {
    assert.equal(obj.camelCase.CAMEL_CASE, true)
  })

  it('should process camelCase', () => {
    assert.equal(obj.snake_case.snakeCase, true)
  })

  it('should process upperCase', () => {
    assert.equal(obj.lowercase.LOWERCASE, true)
  })

  it('should process lowerCase', () => {
    assert.equal(obj.UPPERCASE.uppercase, true)
  })

  it('should process capitalize', () => {
    assert.equal(obj['kebab-case']['Kebab-case'], true)
  })

  it('should process kebabCase', () => {
    assert.equal(obj.justAnotherTest['just-another-test'], true)
  })
})

describe('combined global and local name transforms', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    nameTransforms: ['camelCase']
  }, [
    {
      path: 'snake_case'
    },
    {
      path: 'camelCase',
      nameTransforms: ['upperCase']
    }
  ])

  it('should have processed the global name transform', () => {
    assert.equal(obj.snake_case.snakeCase, true)
  })

  it('should have processed the local name transform on top', () => {
    assert.equal(obj.camelCase.CAMELCASE, true)
  })
})
