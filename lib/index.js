'use strict'

let _ = require('lodash')
let globby = require('globby')
let snakeCase = require('snake-case')
require('coffee-script/register')

class Ekso {
  defaults () {
    return {
      rootDir: process.cwd(),
      global: false,
      excludeDirs: ['node_modules'],
      executeFuncs: false,
      funcArgs: [],
      funcContext: false,
      nameTransforms: [],
      pathTransforms: []
    }
  }

  constructor () {
    return (opts, dirs) => {
      if (!opts && !dirs) {
        opts = {}
        dirs = ['/']
      } else {
        if (_.isPlainObject(opts) && !dirs) {
          dirs = ['/']
        }

        if (_.isArray(opts)) {
          dirs = opts
          opts = {}
        }
      }

      this.options = _.assign({}, this.defaults(), opts)

      return this.processDirs(dirs)
    }
  }

  processDirs (dirs) {
    let retObj = {}

    for (let dirObj of dirs) {
      if (_.isString(dirObj)) {
        dirObj = { path: dirObj }
      }

      _.assign(retObj, this.processDir(dirObj))
    }

    return retObj
  }

  processDir (dirObj) {
    let dir = this.options.rootDir + '/' + dirObj.path
    let paths = globby.sync(dir + '/**/*.{js,coffee}')
    let retObj = {}

    for (let path of paths) {
      let tempObj = this.processFile(path, dirObj)

      if (tempObj !== false) {
        _.merge(retObj, tempObj)
      }
    }

    return retObj
  }

  processFile (path, dirObj) {
    let objPath = path.replace(this.options.rootDir + '/', '')
    let objArray = objPath.split('/')

    if (_.indexOf(this.options.excludeDirs, objArray[0]) !== -1) {
      return false
    } else {
      let retObj = {}
      let objName = objArray.pop().split('.')[0]
      let requiredObj = this.requireFile(path, dirObj)

      for (let transform of this.options.nameTransforms) {
        objName = this.transformString(objName, transform)
      }

      for (let i = 0; i < objArray.length; i++) {
        for (let transform of this.options.pathTransforms) {
          objArray[i] = this.transformString(objArray[i], transform)
        }
      }

      _.set(retObj, objArray.join('.') + '.' + objName, requiredObj)

      return retObj
    }
  }

  requireFile (path, opts) {
    let obj = require(path)
    let context = this.options.funcContext
    let args = this.options.funcArgs

    if (_.isFunction(obj) && (this.options.executeFuncs || opts.executeFuncs)) {
      if (!context && !opts.funcContext) {
        context = obj
      } else if (opts.funcContext) {
        context = opts.funcContext
      }

      if (opts.funcArgs) {
        args = opts.funcArgs
      }

      obj = obj.apply(context, args)
    }

    return obj
  }

  transformString (str, transform) {
    switch (transform) {
      case 'lowerCase':
        return str.toLowerCase()
      case 'upperCase':
        return str.toUpperCase()
      case 'snakeCase':
        return snakeCase(str)
      default:
        return str
    }
  }
}

module.exports = new Ekso()
