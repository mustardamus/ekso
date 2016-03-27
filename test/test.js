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

describe('local path transforms', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms'
  }, [
    {
      path: 'kebab-case'
    },
    {
      path: 'camelCase',
      pathTransforms: ['snakeCase', 'upperCase']
    },
    {
      path: 'snake_case',
      pathTransforms: ['camelCase']
    }
  ])

  it('shouldnt transform if no local path transforms are set', () => {
    assert.equal(obj['kebab-case']['kebab-case'], true)
  })

  it('should have have transformed in combination', () => {
    assert.equal(obj.CAMEL_CASE.camelCase, true)
  })

  it('should have transformed deeper paths', () => {
    assert.equal(obj.snakeCase.snake_case, true)
    assert.equal(obj.snakeCase.camelCase.camelCase, true)
  })
})

describe('combined global and local path transforms', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    pathTransforms: ['camelCase']
  }, [
    {
      path: 'snake_case'
    },
    {
      path: 'camelCase',
      pathTransforms: ['upperCase']
    }
  ])

  it('should have processed the global path transform', () => {
    assert.equal(obj.snakeCase.snake_case, true)
  })

  it('should have processed the local path transform on top', () => {
    assert.equal(obj.CAMELCASE.camelCase, true)
  })
})

describe('global name prefix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    namePrefix: 'prefix'
  })

  it('should have added the prefix to name', () => {
    assert.equal(obj.camelCase.prefixcamelCase, true)
    assert.equal(obj.snake_case.camelCase.prefixcamelCase, true)
  })
})

describe('global name postfix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    namePostfix: 'postfix'
  })

  it('should have added the postfix to name', () => {
    assert.equal(obj.camelCase.camelCasepostfix, true)
    assert.equal(obj.snake_case.camelCase.camelCasepostfix, true)
  })
})

describe('local name prefix and postfix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms'
  }, [
    {
      path: 'camelCase'
    },
    {
      path: 'snake_case',
      namePrefix: 'prefix'
    },
    {
      path: 'justAnotherTest',
      namePostfix: 'postfix'
    },
    {
      path: 'lowercase',
      namePrefix: 'prefix',
      namePostfix: 'postfix'
    }
  ])

  it('should not prefix or postfix if not set', () => {
    assert.equal(obj.camelCase.camelCase, true)
  })

  it('should have prefixed', () => {
    assert.equal(obj.snake_case.prefixsnake_case, true)
    assert.equal(obj.snake_case.camelCase.prefixcamelCase, true)
  })

  it('should have postfixed', () => {
    assert.equal(obj.justAnotherTest.justAnotherTestpostfix, true)
  })

  it('should have prefixed and postfixed', () => {
    assert.equal(obj.lowercase.prefixlowercasepostfix, true)
  })
})

describe('combination of global and local prefix and postfix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    namePrefix: 'globalPrefix'
  }, [
    {
      path: 'camelCase',
      namePrefix: 'localPrefix'
    },
    {
      path: 'snake_case',
      namePostfix: 'local_postfix'
    }
  ])

  it('should have overwritten the global with the local prefix', () => {
    assert.equal(obj.camelCase.localPrefixcamelCase, true)
  })

  it('should have gloabl prefix and local postfix', () => {
    assert.equal(obj.snake_case.globalPrefixsnake_caselocal_postfix, true)
  })
})
