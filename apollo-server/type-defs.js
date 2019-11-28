import fs from 'fs'
import path from 'path'

const exp = fs.readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf8' })

export default exp
