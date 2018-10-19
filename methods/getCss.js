const fs = require('fs')
const path = require('path')
const request = require('request')

const progressBarText = require('./progressBarText')

module.exports = function (pathName, domain, resDir, links, changeLog) {
  return new Promise((resolve, reject) => {
    fs.readdir(`${pathName}`, (err, cssFiles) => {
      if (err) throw err
      // 初始化任务总数
      let totalNum = 0
      // 初始化任务完成数
      let completedNum = 0

      if (links.length === 1) {
        let linkHref = `${domain}${links.attr('href')}`
        let cssName = path.basename(linkHref)

        request(linkHref, (err, res, data) => {
          if (!err && res.statusCode === 200) {
            fs.writeFileSync(`${pathName}/${cssName}`, data, () => {
              resolve()
            })
            console.log('\x1B[31m%s\x1b[39m', `getting ${cssName}`);
          }
        })
      } else if (links.length > 1) {
        for (let i = 0; i < links.length; i++) {
          // 确保 href 值存在
          if (!links[i].attribs || links[i].attribs.href === undefined) continue
          // 筛选正确资源路径下的 css 文件，去除外部库
          else if (links[i].attribs.href.indexOf(resDir) !== -1 && links[i].attribs.href.indexOf('http://')) {
            let linkHref = `${domain}${links[i].attribs.href}`
            let cssName = path.basename(linkHref)
            // 避免同文件重复请求
            if (cssFiles.indexOf(cssName) !== -1) continue
            totalNum++
            request(linkHref, (err, res, data) => {
              // console.log('\x1B[31m%s\x1b[39m', `getting ${cssName}`);
              if (!err && res.statusCode === 200) {
                fs.writeFile(`${pathName}/${cssName}`, data, () => {
                  completedNum++
                  let text = progressBarText(totalNum, completedNum, 'css', 25, cssName)
                  changeLog(text)
                  if (completedNum === totalNum) resolve()
                })
              }
            })
          }
        }
        // resolve()
      }
    })
  })
}