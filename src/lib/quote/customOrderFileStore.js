// Holds the uploaded STL/OBJ File blob in IndexedDB between the calculator and
// the dashboard cart checkout. sessionStorage cannot hold multi-MB binary data,
// and the file must survive navigation until the user confirms the order.

const DB_NAME = 'toolify_custom_orders';
const STORE_NAME = 'files';
const DB_VERSION = 1;

export const PENDING_CUSTOM_FILE_KEY = 'toolify_pending_custom_file';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(mode, action) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const request = action(store);
      tx.oncomplete = () => resolve(request?.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export function saveCustomOrderFile(fileKey, file) {
  return withStore('readwrite', (store) => store.put(file, fileKey));
}

export function getCustomOrderFile(fileKey) {
  return withStore('readonly', (store) => store.get(fileKey));
}

export function clearCustomOrderFile(fileKey) {
  return withStore('readwrite', (store) => store.delete(fileKey));
}
