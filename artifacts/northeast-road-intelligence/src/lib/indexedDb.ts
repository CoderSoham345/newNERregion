// IndexedDB Local Persistence and Offline Synchronization Engine
// Specifically engineered for Field Officials in Remote NER Mountain Areas with Zero Connectivity

export interface OfflineReportRecord {
  id: string; // client-generated UUID
  trackingNumber: string; // NER-XXXXXX
  category: 'Road Blockage' | 'Landslide' | 'Flood' | 'Bridge Damage' | 'Road Damage' | 'Traffic Disruption' | 'Other Hazard';
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  locationName: string;
  stateId: string;
  districtId: string;
  coords: [number, number]; // [lat, lng]
  description: string;
  userName: string;
  userPhone?: string;
  photoBase64?: string;
  createdTimestamp: number;
  createdAtIso: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  syncAttempts: number;
  lastSyncError?: string;
  syncedAt?: string;
}

const DB_NAME = 'uttarpurv_offline_field_db';
const DB_VERSION = 1;
const STORE_REPORTS = 'offline_reports';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in current environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_REPORTS)) {
        const store = db.createObjectStore(STORE_REPORTS, { keyPath: 'id' });
        store.createIndex('syncStatus', 'syncStatus', { unique: false });
        store.createIndex('createdTimestamp', 'createdTimestamp', { unique: false });
        store.createIndex('stateId', 'stateId', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveOfflineReport(report: Omit<OfflineReportRecord, 'id' | 'syncStatus' | 'syncAttempts'>): Promise<OfflineReportRecord> {
  const db = await openDatabase();
  const id = `rep-offline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const record: OfflineReportRecord = {
    ...report,
    id,
    syncStatus: 'pending',
    syncAttempts: 0,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_REPORTS, 'readwrite');
    const store = tx.objectStore(STORE_REPORTS);
    const request = store.put(record);

    request.onsuccess = () => {
      resolve(record);
      notifySyncListeners();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getAllOfflineReports(): Promise<OfflineReportRecord[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_REPORTS, 'readonly');
      const store = tx.objectStore(STORE_REPORTS);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort descending by timestamp
        const records = (request.result as OfflineReportRecord[]).sort(
          (a, b) => b.createdTimestamp - a.createdTimestamp
        );
        resolve(records);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch {
    return [];
  }
}

export async function getPendingOfflineReports(): Promise<OfflineReportRecord[]> {
  const all = await getAllOfflineReports();
  return all.filter((r) => r.syncStatus === 'pending' || r.syncStatus === 'failed');
}

export async function markReportSyncing(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_REPORTS, 'readwrite');
    const store = tx.objectStore(STORE_REPORTS);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const record = getReq.result as OfflineReportRecord;
      if (record) {
        record.syncStatus = 'syncing';
        record.syncAttempts += 1;
        store.put(record);
      }
      resolve();
      notifySyncListeners();
    };

    getReq.onerror = () => reject(getReq.error);
  });
}

export async function markReportSynced(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_REPORTS, 'readwrite');
    const store = tx.objectStore(STORE_REPORTS);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const record = getReq.result as OfflineReportRecord;
      if (record) {
        record.syncStatus = 'synced';
        record.syncedAt = new Date().toISOString();
        store.put(record);
      }
      resolve();
      notifySyncListeners();
    };

    getReq.onerror = () => reject(getReq.error);
  });
}

export async function markReportSyncFailed(id: string, errorMessage: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_REPORTS, 'readwrite');
    const store = tx.objectStore(STORE_REPORTS);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const record = getReq.result as OfflineReportRecord;
      if (record) {
        record.syncStatus = 'failed';
        record.lastSyncError = errorMessage;
        store.put(record);
      }
      resolve();
      notifySyncListeners();
    };

    getReq.onerror = () => reject(getReq.error);
  });
}

export async function clearSyncedReports(): Promise<void> {
  const db = await openDatabase();
  const all = await getAllOfflineReports();
  const tx = db.transaction(STORE_REPORTS, 'readwrite');
  const store = tx.objectStore(STORE_REPORTS);

  for (const item of all) {
    if (item.syncStatus === 'synced') {
      store.delete(item.id);
    }
  }

  return new Promise((resolve) => {
    tx.oncomplete = () => {
      resolve();
      notifySyncListeners();
    };
  });
}

// Global listener hook registry
type SyncCallback = (count: number) => void;
const listeners: Set<SyncCallback> = new Set();

export function subscribeToOfflineSyncUpdates(callback: SyncCallback): () => void {
  listeners.add(callback);
  // Fire initial count
  getPendingOfflineReports().then((pending) => callback(pending.length)).catch(() => {});
  return () => {
    listeners.delete(callback);
  };
}

function notifySyncListeners() {
  getPendingOfflineReports()
    .then((pending) => {
      listeners.forEach((cb) => cb(pending.length));
    })
    .catch(() => {});
}
