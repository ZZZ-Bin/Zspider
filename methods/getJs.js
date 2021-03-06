const fs = require('fs')
const path = require('path')
const request = require('request')

const progressBarText = require('./progressBarText')

module.exports = function (pathName, domain, resDir, javascripts, changeLog) {
  // console.log('\n');
  fs.readdir(pathName, (err, jsFiles) => {
    if (err) throw err

    // 初始化任务总数
    let totalNum = 0
    // 初始化任务完成数
    let completedNum = 0

    if (javascripts.length === 1) {
      let jsSrc = `${domain}${javascripts.attr('src')}`
      let jsName = path.basename(jsSrc)

      request(jsSrc, (err, res, data) => {
        if (!err && res.statusCode === 200) {
          fs.writeFileSync(`${pathName}/${jsName}`, data)
        }
        console.log('\x1B[33m%s\x1b[0m', `getting ${jsName}`);
      })
    } else if (javascripts.length > 1) {
      for (let i in javascripts) {
        // 确保 src 值存在
        if (!javascripts[i].attribs || javascripts[i].attribs.src === undefined) continue
        // 筛选正确资源路径下的 js 文件，去除外部库
        else if (javascripts[i].attribs.src.indexOf(resDir) !== -1 && javascripts[i].attribs.src.indexOf('http://') === -1) {
          let jsSrc = `${domain}${javascripts[i].attribs.src}`
          let jsName = path.basename(jsSrc)
          // 避免同文件重复请求
          if (jsFiles.indexOf(jsName) !== -1) continue
          totalNum++
          request(jsSrc, (err, res, data) => {
            // console.log('\x1B[33m%s\x1b[0m', `getting ${jsName}`);
            if (!err && res.statusCode === 200) {
              fs.writeFile(`${pathName}/${jsName}`, data, (err) => {
                if (err) throw err
                completedNum++
                let text = progressBarText(totalNum, completedNum, 'js', 25, jsName)
                changeLog('','','',text)
              })
            }
          })
        }
      }
    }
  })
}