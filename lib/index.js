'use strict'

let _ = require('lodash')
let globby = require('globby')
require('coffee-script/register')

class Ekso {
  constructor () {
    this.defaults = {
      rootDir: process.cwd(),
      global: false
    }

    return (opts, dirs) => {
      let retObj = {}

      if (_.isArray(opts)) {
        dirs = opts
        opts = {}
      }

      this.options = _.extend({}, this.defaults, opts)

      for (let dirObj of dirs) {
        if (_.isString(dirObj)) {
          dirObj = { path: dirObj }
        }

        _.assign(retObj, this.processDir(dirObj))
      }

      return retObj
    }
  }

  processDir (dirObj) {
    let dir = this.options.rootDir + '/' + dirObj.path
    let paths = globby.sync(dir + '/**/*.{js,coffee}')
    let retObj = {}

    for (let path of paths) {
      _.merge(retObj, this.processFile(path, dirObj))
    }

    return retObj
  }

  processFile (path, dirObj) {
    let retObj = {}
    let objPath = path.replace(this.options.rootDir + '/', '')
    let objArray = objPath.split('/')
    let objName = objArray.pop().split('.')[0]
    let requiredObj = require(path)

    _.set(retObj, objArray.join('.') + '.' + objName, requiredObj)

    return retObj
  }
}

module.exports = new Ekso()
