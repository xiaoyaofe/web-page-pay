import path from 'path'
import express from 'express'
import './utils/agenda'

export default app => {
  app.use('/files', express.static(path.resolve(__dirname, '../live/uploads')))
}
 