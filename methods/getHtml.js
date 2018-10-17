const fs = require('fs')
const request = require('request')

module.exports = async function getHtml(urlName, path) {
  return new Promise((resolve, reject) => {
    request(urlName, function (err, res, data) {
      if (err) throw err
      if (!err && res.statusCode === 200) {
        fs.writeFile(path, data, () => {
          resolve()
        })
      }
    })
  })
  
}