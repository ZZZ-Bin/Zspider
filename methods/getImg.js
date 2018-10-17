const fs = require('fs')
const path = require('path')
const request = require('request')

module.exports = function (pathName, domain, resDir, imgs) {
  fs.readdir(pathName, (err, imgFiles) => {
    if (err) throw err
    if (imgs.length === 1) {
      let imgSrc = `${domain}${imgs.attr('src')}`
      let imgName = path.basename(imgs.attr('src'))
      request(imgSrc).pipe(fs.createWriteStream(`${pathName}/${imgName}`))
    } else if (imgs.length > 1) {
      for (let i in imgs) {
        // 确保 src 值存在
        if (!imgs[i].attribs || imgs[i].attribs.src === undefined) continue
        // 筛选正确资源路径下的 img 文件，去除外部库
        else if (imgs[i].attribs.src.indexOf(resDir) !== -1) {
          let imgSrc = `${domain}${imgs[i].attribs.src}`
          let imgName = path.basename(imgs[i].attribs.src)
          // 避免同文件重复请求
          if (imgFiles.indexOf(imgName) !== -1) continue
          console.log(`getting ${imgName}`);
          request(imgSrc).pipe(fs.createWriteStream(`${pathName}/${imgName}`))
        }
      }
    }
  })
}