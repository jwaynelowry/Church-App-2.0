import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';

// Schema versions and their migrations
const migrations = {
  users: {
    currentVersion: 2, // Incremented version number
    updates: {
      1: (data) => ({
        ...data,
        role: data.role || 'user',
        updatedAt: data.updatedAt || new Date().toISOString()
      }),
      2: (data) => ({
        ...data,
        role: 'user', // Explicitly set role to 'user'
        updatedAt: new Date().toISOString()
      })
    }
  },
  churches: {
    currentVersion: 1,
    updates: {
      1: (data) => ({
        ...data,
        status: data.status || 'active',
        updatedAt: data.updatedAt || new Date().toISOString()
      })
    }
  }
};

// Migrate a single document
async function migrateDocument(collectionName, docId, data) {
  const migration = migrations[collectionName];
  let updatedData = { ...data };
  
  // Apply all migrations sequentially
  const currentVersion = data.schemaVersion || 0;
  for (let version = currentVersion + 1; version <= migration.currentVersion; version++) {
    if (migration.updates[version]) {
      updatedData = migration.updates[version](updatedData);
    }
  }
  
  // Add schema version
  updatedData.schemaVersion = migration.currentVersion;
  
  // Update the document
  await updateDoc(doc(db, collectionName, docId), updatedData);
  return updatedData;
}

// Migrate all documents in a collection
export async function migrateCollection(collectionName) {
  if (!migrations[collectionName]) {
    throw new Error(`No migration defined for collection: ${collectionName}`);
  }

  const querySnapshot = await getDocs(collection(db, collectionName));
  const batch = writeBatch(db);
  let migratedCount = 0;
  let skippedCount = 0;

  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    
    // Skip if already at current version
    if (data.schemaVersion === migrations[collectionName].currentVersion) {
      skippedCount++;
      continue;
    }

    try {
      const updatedData = await migrateDocument(collectionName, docSnapshot.id, data);
      batch.update(doc(db, collectionName, docSnapshot.id), updatedData);
      migratedCount++;
    } catch (error) {
      console.error(`Error migrating document ${docSnapshot.id}:`, error);
    }
  }

  // Commit all updates in a batch
  if (migratedCount > 0) {
    await batch.commit();
  }

  return { migratedCount, skippedCount };
}