const fs = require('fs')
const cheerio = require('cheerio')

const createProgram = require('./methods/createProgram')
const getHtml = require('./methods/getHtml')
const getCss = require('./methods/getCss')
const getBgImg = require('./methods/getBgImg')
const getImg = require('./methods/getImg')
const getJs = require('./methods/getJs')
const getOther = require('./methods/getOther')

module.exports = class Zspider {
  constructor(paramsObject) {
    this.paramsObject = paramsObject
    this.name = process.argv[2] || paramsObject.domain.split('.')[1]
  }

 /**
 * @param {Object} paramsObject
 * @param {string} paramsObject.domain - 域名
 * @param {string} paramsObject.htmlName - 生成的 html 文件名
 * @param {string} paramsObject.resDir - 资源路径
 * @param {string} paramsObject.otherPage - 分页
 */

  static run(paramsObject) {
    const instance = new Zspider(paramsObject)
    instance.run()
  }

  async run() {
    let { domain, htmlName, resDir, otherPage } = this.paramsObject
    htmlName = htmlName || 'index.html'
    otherPage = otherPage || ''

    createProgram('./', this.name)

    await getHtml(`${domain}/${otherPage}`, `./${this.name}/${htmlName}`)

    const body = (fs.readFileSync(`./${this.name}/${htmlName}`).toString())
    const $ = cheerio.load(body)

    await getCss(`.\\${this.name}\\css`, domain, resDir, $('link'))

    getBgImg(`.\\${this.name}\\css`, `.\\${this.name}\\img`, domain, resDir)

    getImg(`.\\${this.name}\\img`, domain, resDir, $('body img'))

    // getJs(`.\\${this.name}\\js`, domain, resDir, $('script'))

    // let othersSet = getOther(`${this.name}/${htmlName}`, $('a'))
    
  }
}
