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
    'deep/directory',
    'byFile.js'
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

  it('should process files directly', () => {
    assert.equal(obj.byFile, true)
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

  it('should process files directly', () => {
    assert.equal(obj.byFile, true)
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
    { path: 'deep/directory' },
    { path: 'byFile.js' }
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

  it('should process files directly', () => {
    assert.equal(obj.byFile, true)
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

describe('overwrite global function options with locals', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs',
    executeFuncs: true,
    funcArgs: ['global', 'global'],
    funcContext: 'global'
  }, [
    {
      path: 'byString',
      funcArgs: ['local', 'local'],
      funcContext: 'local'
    },
    {
      path: 'deep',
      executeFuncs: false
    }
  ])

  it('should overwrite funcArgs', () => {
    assert.equal(obj.byString.function[0], 'local')
  })

  it('should overwrite funcContext', () => {
    assert.equal(obj.byString.function[2], 'local')
  })

  it('should not executed function', () => {
    assert.equal(typeof obj.deep.directory.works.function, 'function')
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

describe('overwrite global name transforms with local', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    nameTransforms: ['upperCase']
  }, [
    {
      path: 'snake_case'
    },
    {
      path: 'camelCase',
      nameTransforms: ['kebabCase']
    }
  ])

  it('should have processed the global name transform', () => {
    assert.equal(obj.snake_case.SNAKE_CASE, true)
  })

  it('should have overwritten with the local name transform', () => {
    assert.equal(obj.camelCase['camel-case'], true)
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

describe('overwrite global with local path transforms', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    pathTransforms: ['upperCase']
  }, [
    {
      path: 'snake_case'
    },
    {
      path: 'camelCase',
      pathTransforms: ['kebabCase']
    }
  ])

  it('should have processed the global path transform', () => {
    assert.equal(obj.SNAKE_CASE.snake_case, true)
  })

  it('should have overwritten with the local path transform', () => {
    assert.equal(obj['camel-case'].camelCase, true)
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

describe('overwrite global with local name prefix and postfix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    namePrefix: '_globalPrefix_',
    namePostfix: '_globalPostfix_'
  }, [
    {
      path: 'camelCase',
      namePrefix: '_localPrefix_'
    },
    {
      path: 'snake_case',
      namePostfix: '_localPostfix_'
    },
    {
      path: 'lowercase',
      namePrefix: '_localPrefix_',
      namePostfix: '_localPostfix_'
    },
  ])

  it('should have overwritten the global with the local prefix', () => {
    assert.equal(obj.camelCase._localPrefix_camelCase_globalPostfix_, true)
  })

  it('should have overwritten the global with the local postfix', () => {
    assert.equal(obj.snake_case._globalPrefix_snake_case_localPostfix_, true)
  })

  it('should have overwritten the global with the local prefix and postfix', () => {
    assert.equal(obj.lowercase._localPrefix_lowercase_localPostfix_, true)
  })
})

describe('global path prefix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    pathPrefix: 'prefix'
  })

  it('should have added the prefix to path parts', () => {
    assert.equal(obj.prefixcamelCase.camelCase, true)
    assert.equal(obj.prefixsnake_case.prefixcamelCase.camelCase, true)
  })
})

describe('global path postfix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    pathPostfix: 'postfix'
  })

  it('should have added the postfix to path parts', () => {
    assert.equal(obj.camelCasepostfix.camelCase, true)
    assert.equal(obj.snake_casepostfix.camelCasepostfix.camelCase, true)
  })
})

describe('local path prefix and postfix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms'
  }, [
    {
      path: 'camelCase'
    },
    {
      path: 'snake_case',
      pathPrefix: 'prefix'
    },
    {
      path: 'justAnotherTest',
      pathPostfix: 'postfix'
    },
    {
      path: 'lowercase',
      pathPrefix: 'prefix',
      pathPostfix: 'postfix'
    }
  ])

  it('should not prefix or postfix if not set', () => {
    assert.equal(obj.camelCase.camelCase, true)
  })

  it('should have prefixed', () => {
    assert.equal(obj.prefixsnake_case.snake_case, true)
    assert.equal(obj.prefixsnake_case.prefixcamelCase.camelCase, true)
  })

  it('should have postfixed', () => {
    assert.equal(obj.justAnotherTestpostfix.justAnotherTest, true)
  })

  it('should have prefixed and postfixed', () => {
    assert.equal(obj.prefixlowercasepostfix.lowercase, true)
  })
})

describe('overwrite the global with local path prefix and postfix', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms',
    pathPrefix: '_globalPrefix_',
    pathPostfix: '_globalPostfix_'
  }, [
    {
      path: 'camelCase',
      pathPrefix: '_localPrefix_'
    },
    {
      path: 'snake_case',
      pathPostfix: '_localPostfix_'
    },
    {
      path: 'lowercase',
      pathPrefix: '_localPrefix_',
      pathPostfix: '_localPostfix_'
    }
  ])

  it('should have overwritten the global with the local prefix', () => {
    assert.equal(obj._localPrefix_camelCase_globalPostfix_.camelCase, true)
  })

  it('should have overwritten the global with the local postfix', () => {
    assert.equal(obj._globalPrefix_snake_case_localPostfix_.snake_case, true)
  })

  it('should have overwritten the global with the local prefix and postfix', () => {
    assert.equal(obj._localPrefix_lowercase_localPostfix_.lowercase, true)
  })
})

describe('global option to make object global', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms/justAnotherTest',
    global: true
  })

  it('should have returned an object like normal', () => {
    assert.equal(obj.justAnotherTest, true)
  })

  it('should have made the object global', () => {
    assert.equal(justAnotherTest, true)
  })
})

describe('last part of the path to be global', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/transforms/snake_case',
    globalLast: true
  })

  it('should have returned an object like normal', () => {
    assert.equal(obj.snake_case, true)
    assert.equal(obj.camelCase.camelCase, true)
  })

  it('should have made the last part of the path global', () => {
    assert.equal(snake_case, true)
    assert.equal(camelCase, true)
  })
})

describe('global object by local definition', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs'
  }, [
    {
      path: 'byString'
    },
    {
      path: 'deep',
      global: true
    }
  ])

  it('should not been global if no option is set', () =>{
    assert.equal(obj.byString.boolean, true)
    assert.equal(typeof byString, 'undefined')
  })

  it('should been global if option is set', () => {
    assert.equal(deep.directory.boolean, true)
    assert.equal(deep.directory.works.function(true)[0], true)
  })
})

describe('overwrite global global option with local', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs/global1',
    global: true
  }, [
    {
      path: 'test1'
    },
    {
      path: 'test2',
      global: false
    }
  ])

  it('should have set the global object', () => {
    assert.equal(test1.test1, true)
  })

  it('should have not set the global object if overwritten b y local option', () => {
    assert.equal(typeof test2, 'undefined')
  })
})

describe('overwrite global last global option with local', () => {

})

describe('global last part of path by local definition', () => {
  let obj = ekso({
    rootDir: __dirname + '/dirs'
  }, [
    {
      path: 'byString'
    },
    {
      path: 'transforms/lowercase',
      globalLast: true
    }
  ])

  it('should not been global last part of path if no option is set', () =>{
    assert.equal(obj.byString.boolean, true)
    assert.equal(typeof byString, 'undefined')
  })

  it('should been global last part of path if option is set', () => {
    assert.equal(lowercase, true)
  })
})

describe('global option for global objects by require', () => {
  let obj = ekso({
    globalRequire: {
      _: 'lodash',
      fs: 'fs'
    }
  })

  it('should have requires it globally', () => {
    assert.equal(typeof _, 'function')
    assert.equal(typeof fs, 'object')
    assert.equal(typeof _.toUpper, 'function')
    assert.equal(typeof fs.readFile, 'function')
  })
})
