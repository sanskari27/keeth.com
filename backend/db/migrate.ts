import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
config();
// for migrations
console.log(process.env.DATABASE_URL);

const migrationClient = postgres(process.env.DATABASE_URL as string, { max: 1 });

export default async function migrateDB() {
	await migrate(drizzle(migrationClient), {
		migrationsFolder: './db/migrations',
	});
	await migrationClient.end();
}

migrateDB();
