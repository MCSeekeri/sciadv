const fs = require('fs/promises')

const pageageFile = {
  "name": "@mcseekeri/sciadv",
  "description": "sciadv library",
  "version": `1.0.${Date.now()}`,
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mcseekeri/sciadv.git"
  },
  "author": "mcseekeri",
  "keywords": ["sciadv", "static"],
  "main": "LICENSE"
}

const pageageFileStr = JSON.stringify(pageageFile)
fs.writeFile('./public/package.json', pageageFileStr, 'utf8', (err) => {
  if (err) throw err
})
