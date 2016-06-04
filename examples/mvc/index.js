'use strict'

const ekso = require('../../lib')

const App = ekso({
  rootDir: __dirname,                 // set root directory to this scripts directory
  pathTransforms: ['capitalize'],     // capitalize all paths
  globalRequire: {                    // globally require the following modules
    _: 'lodash'                       // lodash as _
  }
}, [
  {
    path: 'config',                   // require whole config directory
    global: true                      // make it global - Config
  },
  {
    path: 'helpers',                  // require whole helpers directory
    global: true                      // make it global - Helpers
  },
  {
    path: 'views',                    // require whole views directory
    global: true                      // make it global - Views
  },
  {
    path: 'models',                   // require whole models directory
    nameTransforms: ['camelCase', 'capitalize'], // transform the name - ie User
    globalLast: true,                 // make last part of the path global - ie User
    executeFuncs: true,               // execute exported functions
    funcContext: 'Model Context',     // with 'this' when calling the function
    funcArgs: ['Model db Variable']   // pass arguments to the function when calling
  },
  {
    path: 'controllers',              // require whole controllers directory
    nameTransforms: ['camelCase', 'capitalize'], // transform the name - ie Users
    namePostfix: 'Controller'         // append string to name - ie UsersController
  }
])

App.Controllers.UsersController.index()
console.log('==========')
console.log(App)

/*
User Model Initialized
db: Model db Variable
this: [String: 'Model Context']
db url config: some db url
Users Controller Index Function
Invoke Helper: Ekso example
User Model: User Model Schema
User Index View: Users Index Template: User Model Schema
==========
{ Config:
   { app: { name: 'ekso example' },
     database: { url: 'some db url' } },
  Helpers: { capitalize: [Function] },
  Views: { Users: { index: [Function], read: [Function] } },
  Models: { User: 'User Model Schema' },
  Controllers: { UsersController: { index: [Function], create: [Function] } } }
*/
