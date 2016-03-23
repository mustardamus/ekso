'use strict'

let _ = require('lodash')
let globby = require('globby')
require('coffee-script/register')

class Ekso {
  constructor () {
    this.defaults = {
      rootDir: process.cwd(),
      global: false,
      excludeDirs: ['node_modules'],
      executeFuncs: false,
      funcArgs: [],
      funcContext: false
    }

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

      this.options = _.assign({}, this.defaults, opts)

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
      let requiredObj = require(path)

      if (_.isFunction(requiredObj) && this.options.executeFuncs) {
        let context = requiredObj

        if (this.options.funcContext) {
          context = this.options.funcContext
        }

        requiredObj = requiredObj.apply(context, this.options.funcArgs)
      }

      _.set(retObj, objArray.join('.') + '.' + objName, requiredObj)

      return retObj
    }
  }
}

module.exports = new Ekso()
