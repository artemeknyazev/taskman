import path from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
const dbPath = path.resolve(__dirname, 'db/db.json')
const adapter = new FileSync(dbPath)
export default low(adapter)