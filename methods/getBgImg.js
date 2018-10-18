const fs = require('fs')
const path = require('path')
const request = require('request')

module.exports = function (cssPathName, pathName, domain, resDir) {
  fs.readdir(pathName, (err, imgFiles) => {
    if (err) throw err

    fs.readFile(`${cssPathName}/index.css`,'utf-8', function (err, data) {
      if (err) throw err
      // 筛选 url()
      const reg = /\"(\S*)\"/gi
      let arr = data.match(reg)
      let resSet = new Set(arr)
      for (let item of resSet) {
        if (item.indexOf('/') === -1) {
          resSet.delete(item)
          continue
        }
        // 格式修正
        item = item.replace(/\.\.\/|\"/g, '')
        let imgSrc = `${domain}/${resDir}/${item}`
        let imgName = path.basename(imgSrc)
        // 避免同文件重复请求
        if (imgFiles.indexOf(imgName) !== -1) continue
        request(imgSrc).pipe(fs.createWriteStream(`${pathName}/${imgName}`))
        console.log('\x1B[34m%s\x1b[39m', `getting ${imgName}`)
      }
    })
  })
}