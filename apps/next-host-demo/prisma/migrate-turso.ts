import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, readdirSync } from 'fs';
import { createClient } from '@libsql/client';

// Load .env from the app root directory
config({ path: resolve(__dirname, '..', '.env') });

// Verify environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

console.log('📍 DATABASE_URL:', process.env.DATABASE_URL);
console.log('🔑 TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '✓ Present' : '✗ Missing');

// Create LibSQL client for Turso
const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function applyMigrations() {
  console.log('🔄 Starting migration process...\n');

  const migrationsDir = resolve(__dirname, 'migrations');
  const migrationFolders = readdirSync(migrationsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();

  console.log(`📁 Found ${migrationFolders.length} migrations:\n`);

  for (const folder of migrationFolders) {
    const migrationFile = resolve(migrationsDir, folder, 'migration.sql');
    
    try {
      console.log(`⏳ Applying migration: ${folder}...`);
      
      const sql = readFileSync(migrationFile, 'utf-8');
      
      // Execute the entire migration SQL
      try {
        await client.executeMultiple(sql);
      } catch (error: any) {
        // If executeMultiple is not available or fails, try individual statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
          if (statement && !statement.startsWith('PRAGMA')) {
            await client.execute(statement);
          }
        }
      }

      console.log(`✅ Migration applied: ${folder}\n`);
    } catch (error: any) {
      // Check if the error is because the table already exists
      if (error.message?.includes('already exists')) {
        console.log(`⚠️  Migration skipped (already applied): ${folder}\n`);
        continue;
      }
      
      console.error(`❌ Failed to apply migration ${folder}:`, error.message);
      throw error;
    }
  }

  console.log('✅ All migrations applied successfully!');
}

applyMigrations()
  .then(() => {
    console.log('\n🎉 Migration process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration process failed:', error);
    process.exit(1);
  });
