/* istanbul ignore file */
import 'dotenv/config'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongoHelper'

const mongoUrl = MongoHelper.getMongoUrl()
const port = process.env.PORT ?? 5050
MongoHelper.connect(mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(port, () => { console.log(`Server running at ${mongoUrl}:${port}`) })
  })
  .catch(console.error)
