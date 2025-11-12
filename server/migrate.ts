import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import "dotenv/config";

async function runMigrations() {
  console.log("⏳ Running migrations...");

  const db = drizzle(process.env.DATABASE_URL!);

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("✅ Migrations completed!");
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("❌ Migration failed!");
  console.error(err);
  process.exit(1);
});
