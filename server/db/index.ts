
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Default to a local connection string or env var
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/bpnav_db';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
