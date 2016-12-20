'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const globby = require('globby')
const minimatch = require('minimatch')
require('coffee-script/register')

class Ekso {
  defaults () {
    return {
      rootDir: process.cwd(),
      excludePaths: ['**/node_modules/**'],
      executeFuncs: false,
      funcArgs: [],
      funcContext: false,
      nameTransforms: [],
      pathTransforms: [],
      namePrefix: '',
      namePostfix: '',
      pathPrefix: '',
      pathPostfix: '',
      global: false,
      globalLast: false,
      globalRequire: {}
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

      for (let key in this.options.globalRequire) {
        global[key] = require(this.options.globalRequire[key])
      }

      return this.processDirs(dirs)
    }
  }

  processDirs (dirs) {
    let retObj = {}
    let setGlobal = this.options.global

    for (let dirObj of dirs) {
      if (_.isString(dirObj)) {
        dirObj = { path: dirObj }
      }

      let tempObj = this.processDir(dirObj)

      if (_.isBoolean(dirObj.global)) {
        setGlobal = dirObj.global
      }

      if (setGlobal) {
        _.assign(global, tempObj)
      }

      _.assign(retObj, tempObj)
    }

    return retObj
  }

  processDir (dirObj) {
    let dir = this.options.rootDir + '/' + dirObj.path
    let paths = []
    let retObj = {}

    if (fs.lstatSync(dir).isDirectory()) {
      paths = globby.sync(dir + '/**/*.{js,coffee}')
    } else {
      paths = [dir]
    }

    for (let filePath of paths) {
      let tempObj = this.processFile(filePath, dirObj)

      if (tempObj !== false) {
        _.merge(retObj, tempObj)
      }
    }

    return retObj
  }

  processFile (filePath, dirObj) {
    let normPath = path.normalize(filePath)
    let objPath = normPath.replace(this.options.rootDir + '/', '')
    let objArray = objPath.split('/')

    for (let matchPath of this.options.excludePaths) {
      if (minimatch(objPath, matchPath)) {
        return false
      }
    }
  
    let retObj = {}
    let objName = objArray.pop().split('.')[0]
    let requiredObj = this.requireFile(normPath, dirObj)
    let globalLast = this.options.globalLast

    objName = this.transformName(objName, dirObj.nameTransforms)
    objName = this.prePostFixName(objName, dirObj.namePrefix, dirObj.namePostfix)
    objArray = this.transformPath(objArray, dirObj.pathTransforms)
    objArray = this.prePostFixPath(objArray, dirObj.pathPrefix, dirObj.pathPostfix)

    if (objArray.length === 0) {
      objPath = objName
    } else {
      objPath = objArray.join('.') + '.' + objName
    }
    
    _.set(retObj, objPath, requiredObj)

    if (_.isBoolean(dirObj.globalLast)) {
      globalLast = dirObj.globalLast
    }

    if (globalLast) {
      global[objName] = _.get(retObj, objPath)
    }

    return retObj
  }

  requireFile (filePath, opts) {
    let obj = require(filePath)
    let context = this.options.funcContext
    let args = this.options.funcArgs
    let executeFunc = this.options.executeFuncs

    if (_.isBoolean(opts.executeFuncs)) {
      executeFunc = opts.executeFuncs
    }

    if (_.isFunction(obj) && executeFunc) {
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
        return _.toLower(str)
      case 'upperCase':
        return _.toUpper(str)
      case 'snakeCase':
        return _.snakeCase(str)
      case 'camelCase':
        return _.camelCase(str)
      case 'kebabCase':
        return _.kebabCase(str)
      case 'capitalize':
        return _.capitalize(str)
      default:
        return str
    }
  }

  transformName (str, transforms) {
    if (!transforms) {
      transforms = this.options.nameTransforms
    }

    for (let transform of transforms) {
      str = this.transformString(str, transform)
    }

    return str
  }

  transformPath (arr, transforms) {
    if (!transforms) {
      transforms = this.options.pathTransforms
    }

    for (let i = 0; i < arr.length; i++) {
      for (let transform of transforms) {
        arr[i] = this.transformString(arr[i], transform)
      }
    }

    return arr
  }

  prePostFixName (str, prefix, postfix) {
    if (!prefix) {
      prefix = this.options.namePrefix
    }

    if (!postfix) {
      postfix = this.options.namePostfix
    }

    str = prefix + str
    str = str + postfix

    return str
  }

  prePostFixPath (arr, prefix, postfix) {
    if (!prefix) {
      prefix = this.options.pathPrefix
    }

    if (!postfix) {
      postfix = this.options.pathPostfix
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i] = prefix + arr[i]
      arr[i] = arr[i] + postfix
    }

    return arr
  }
}

module.exports = new Ekso()
