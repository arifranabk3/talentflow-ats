import { connectDatabase, disconnectDatabase } from '../config/database';

async function checkAtlasPermissions() {
  const conn = await connectDatabase();
  try {
    const admin = conn.connection.db?.admin();
    if (!admin) {
      console.log('No admin db available');
      return;
    }
    const dbs = await admin.listDatabases();
    console.log('User has cluster-wide listDatabases permission. Databases listed:');
    for (const d of dbs.databases) {
      console.log(' -', d.name);
    }
  } catch (err: any) {
    console.log('User is restricted (cannot list all databases):', err.message);
  } finally {
    await disconnectDatabase();
  }
}

checkAtlasPermissions();
