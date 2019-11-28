

declare const __dirname

import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import mkdirp from 'mkdirp'
import Chalk from 'chalk'
const resolve = require('path').resolve

mkdirp(resolve(__dirname, '../../live'))

export const db = (function () {
  const table = new Lowdb(
    new FileSync(resolve(__dirname, '../../live/db.json'))
  )
  table.defaults({
    messages: [],
    uploads: [],
  }).write()
  return table
})()


export const AppInfos = function () {
  const table = new Lowdb(
    new FileSync(resolve(__dirname, "../../live/datas/appInfos.json"))
  )
  table.defaults({}).write()
  return table
}


export const access_token = function () {
  const table = new Lowdb(
    new FileSync(resolve(__dirname, '../../live/oa/access_token.json'))
  )
  table.defaults({}).write()
  return table
}


export const user_info = function () {
  const table = new Lowdb(
    new FileSync(resolve(__dirname, '../../live/oa/user_info.json'))
  )
  table.defaults({}).write()
  return table
}