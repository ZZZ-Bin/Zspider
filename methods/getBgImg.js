const fs = require('fs')
const path = require('path')
const request = require('request')

const progressBarText = require('./progressBarText')

module.exports = function (cssPathName, pathName, domain, resDir, changeLog) {
  fs.readdir(pathName, (err, imgFiles) => {
    if (err) throw err

    fs.readFile(`${cssPathName}/index.css`,'utf-8', function (err, data) {
      if (err) throw err
      // 筛选 url()
      const reg = /\"(\S*)\"/gi
      let arr = data.match(reg)
      let resSet = new Set(arr)
      // 初始化任务总数
      let totalNum = 0
      // 初始化任务完成数
      let completedNum = 0
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
        totalNum++
        request(imgSrc).pipe(fs.createWriteStream(`${pathName}/${imgName}`)).on('close', () => {
          completedNum++
          let text = progressBarText(totalNum, completedNum, 'bgImg', 25, imgName)
          changeLog('', text)
        })
        // console.log('\x1B[34m%s\x1b[39m', `getting ${imgName}`)
      }
    })
  })
}