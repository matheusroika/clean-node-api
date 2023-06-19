import 'dotenv/config'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongoHelper'

const mongoUrl = process.env.MONGO_URL ?? process.env.MONGO_REMOTE_URL
const port = process.env.PORT ?? 5050
MongoHelper.connect(mongoUrl as string)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(port, () => { console.log(`Server running at port ${port}`) })
  })
  .catch(console.error)
