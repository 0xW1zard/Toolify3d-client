import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';

// Uploads the printable model file directly to Firebase Storage and returns a
// permanent download URL. Only this URL string is persisted in MongoDB, keeping
// the database lightweight and avoiding the 16MB document limit.
//
// Path: custom-orders/{userId}/{uuid}/{fileName}
export async function uploadCustomOrderFile(userId, file) {
  const storagePath = `custom-orders/${userId}/${crypto.randomUUID()}/${file.name}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || 'application/octet-stream',
  });
  const fileUrl = await getDownloadURL(storageRef);

  return { fileUrl, storagePath, fileSize: file.size, fileName: file.name };
}
