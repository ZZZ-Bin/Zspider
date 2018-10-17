// create program
const fs = require('fs')

module.exports = function createProgram(path, name) {
  fs.readdir(path, (err, data) => {
    if (err) throw err
    if (data.indexOf(name) === -1) {
      fs.mkdir(`${path}/${name}`, (err) => {
        if (err) throw err
        Promise.resolve(fs.readdir(`${path}/${name}`, (err, data) => {
          if (err) throw err
    
          if (data.indexOf('img') === -1) {
            fs.mkdirSync(`${path}/${name}/img`)
          }
          if (data.indexOf('css') === -1) {
            fs.mkdirSync(`${path}/${name}/css`)
          }
          if (data.indexOf('js') === -1) {
            fs.mkdirSync(`${path}/${name}/js`)
          }
        }))
      })
    }
  })
}