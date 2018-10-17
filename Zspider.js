const request = require('request');
const fs = require('fs')
const cheerio = require('cheerio')
const path = require('path')

const createProgram = require('./methods/createProgram')
const getHtml = require('./methods/getHtml')
const getCss = require('./methods/getCss')
const getBgImg = require('./methods/getBgImg')
const getImg = require('./methods/getImg')
const getJs = require('./methods/getJs')

class Zspider {
  constructor(paramsObject) {
    this.paramsObject = paramsObject
    this.name = process.argv[2] || paramsObject.domain.split('.')[1]
  }

  async run() {
    let { domain, htmlName, resDir, otherPage } = this.paramsObject
    htmlName = htmlName || 'index.html'
    otherPage = otherPage || ''

    createProgram(__dirname, this.name)

    await getHtml(`${domain}/${otherPage}`, `${__dirname}/${this.name}/${htmlName}`)

    const body = (fs.readFileSync(`${__dirname}/${this.name}/${htmlName}`).toString())
    const $ = cheerio.load(body)

    await getCss(`${__dirname}\\${this.name}\\css`, domain, resDir, $('link'))

    getBgImg(`${__dirname}\\${this.name}\\css`, `${__dirname}\\${this.name}\\img`, domain, resDir)

    getImg(`${__dirname}\\${this.name}\\img`, domain, resDir, $('body img'))

    getJs(`${__dirname}\\${this.name}\\js`, domain, resDir, $('script'))
  }
}
