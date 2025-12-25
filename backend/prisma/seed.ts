import 'dotenv/config'
import { seedAdmin } from '../src/database/seeds/admin.seed'

async function main() {
  await seedAdmin()
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
