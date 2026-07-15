import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/firebase';
import { apiFetch, fetchToken, getAccessToken } from '@/lib/api/client';

let firebaseAuthPromise = null;

export async function ensureFirebaseAuth() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  if (!firebaseAuthPromise) {
    firebaseAuthPromise = (async () => {
      if (!getAccessToken()) {
        await fetchToken();
      }

      const { token } = await apiFetch('/auth/firebase-token');
      await signInWithCustomToken(auth, token);
      return auth.currentUser;
    })().finally(() => {
      firebaseAuthPromise = null;
    });
  }

  return firebaseAuthPromise;
}
