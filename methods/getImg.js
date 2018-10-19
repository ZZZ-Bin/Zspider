const fs = require('fs')
const path = require('path')
const request = require('request')

const progressBarText = require('./progressBarText')

module.exports = function (pathName, domain, resDir, imgs, changeLog) {
  fs.readdir(pathName, (err, imgFiles) => {
    if (err) throw err
    // 初始化任务总数
    let totalNum = 0
    // 初始化任务完成数
    let completedNum = 0

    if (imgs.length === 1) {
      let imgSrc = `${domain}${imgs.attr('src')}`
      let imgName = path.basename(imgs.attr('src'))
      console.log('\x1B[34m%s\x1b[39m', `getting ${imgName}`)
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
          totalNum++
          request(imgSrc).pipe(fs.createWriteStream(`${pathName}/${imgName}`).on('close', () => {
            completedNum++
            let text = progressBarText(totalNum, completedNum, 'img', 25, imgName)
            changeLog('','',text)
          }))
        }
      }
    }
  })
}