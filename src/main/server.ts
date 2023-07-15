/* istanbul ignore file */
import 'dotenv/config'
import { mongoHelper } from '@/infra/db/mongodb/mongoHelper'

const mongoUrl = mongoHelper.getMongoUrl()
const port = process.env.PORT ?? 5050
mongoHelper.connect(mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(port, () => { console.log(`Server running at port ${port}`) })
  })
  .catch(console.error)
