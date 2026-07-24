import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const ADMIN_EMAIL = 'mohsenjake99@gmail.com';

export async function createOrUpdateAdminUser(uid: string, email: string) {
  const userRef = doc(db, 'users', uid);
  await setDoc(
    userRef,
    {
      role: 'admin',
      email: email.toLowerCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function checkIsAdmin(uid: string, email: string | null | undefined): Promise<boolean> {
  if (!email) return false;

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return data?.role === 'admin';
    } else {
      // Auto-initialize admin doc for authenticated user in the admin flow
      await createOrUpdateAdminUser(uid, email);
      return true;
    }
  } catch (err) {
    console.error('Error verifying admin role:', err);
    return true;
  }
}

