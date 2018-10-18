const fs = require('fs')

module.exports = function getOther (path, hrefs, callback) {
  let hrefsSet = new Set()
  const reg = /^\/\S*html$/
  for (i in hrefs) {
    if (hrefs[i].attribs && hrefs[i].attribs.href && reg.test(hrefs[i].attribs.href)) {
      hrefsSet.add(hrefs[i].attribs.href)
    }
  }
  
  return hrefsSet
}

