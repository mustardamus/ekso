'use strict'

let _ = require('lodash')
let globby = require('globby')
require('coffee-script/register')

class Ekso {
  constructor () {
    this.defaults = {
      rootDir: process.cwd()
    }

    return (opts, dirs) => {
      if (_.isArray(opts)) {
        dirs = opts
        opts = {}
      }

      this.options = _.extend({}, this.defaults, opts)

      for (let dirObj of dirs) {
        if (_.isString(dirObj)) {
          dirObj = { path: dirObj }
        }

        this.processDir(dirObj)
      }
    }
  }

  processDir (dirObj) {
    let dir = this.options.rootDir + '/' + dirObj.path

    globby(dir + '/*.{js,coffee}').then((paths) => {
      for (let path of paths) {
        this.processFile(path, dirObj)
      }
    })
  }

  processFile (path, dirObj) {
    let objPath = path.replace(this.options.rootDir + '/', '')
    let objArray = objPath.split('/')
    let objName = objArray.pop().split('.')[0]
    let retObj = require(path)

    _.set(global, objArray.join('.') + '.' + objName, retObj)
  }
}

module.exports = new Ekso()
