'use strict'

let fs = require('fs')
let _ = require('lodash')
let globby = require('globby')
require('coffee-script/register')

class Ekso {
  defaults () {
    return {
      rootDir: process.cwd(),
      excludeDirs: ['node_modules'],
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

    for (let dirObj of dirs) {
      if (_.isString(dirObj)) {
        dirObj = { path: dirObj }
      }

      let tempObj = this.processDir(dirObj)

      if (this.options.global || dirObj.global) {
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

      objName = this.transformName(objName, dirObj.nameTransforms)
      objName = this.prePostFixName(objName, dirObj.namePrefix, dirObj.namePostfix)

      objArray = this.transformPath(objArray, dirObj.pathTransforms)
      objArray = this.prePostFixPath(objArray, dirObj.pathPrefix, dirObj.pathPostfix)

      let objPath = objArray.join('.') + '.' + objName

      _.set(retObj, objPath, requiredObj)

      if (this.options.globalLast || dirObj.globalLast) {
        global[objName] = _.get(retObj, objPath)
      }

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
    transforms = _.union(this.options.pathTransforms, transforms || [])

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
