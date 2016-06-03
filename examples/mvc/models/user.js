module.exports = function (db) {
  console.log('User Model Initialized')
  console.log('db:', db)
  console.log('this:', this)
  console.log('db url config:', Config.database.url)

  return 'User Model Schema'
}
