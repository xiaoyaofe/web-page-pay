import {
  db
} from './utils/db'
import {
  AppInfos
} from './utils/db'
import {
  processUpload
} from './utils/upload'

export default ({
  req,
  connection
}) => {
  return {
    db,
    AppInfos,
    processUpload,
  }
}