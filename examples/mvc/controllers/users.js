module.exports = {
  index: function () {
    console.log('Users Controller Index Function')
    console.log('Invoke Helper:', Helpers.capitalize(Config.app.name))
    console.log('User Model:', User)
    console.log('User Index View:', Views.Users.index(User))
  },

  create: function () {
    console.log('Users Controller Create Function')
  }
}
