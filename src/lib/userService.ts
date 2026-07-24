import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const ADMIN_EMAIL = 'mohsenjake99@gmail.com';

export async function createOrUpdateAdminUser(uid: string, email: string) {
  if (email.toLowerCase() !== ADMIN_EMAIL) return;
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
  if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
    return false;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return data?.role === 'admin';
    } else {
      // If user doc doesn't exist yet, auto-initialize for the authorized admin email
      await createOrUpdateAdminUser(uid, email);
      return true;
    }
  } catch (err) {
    console.error('Error verifying admin role:', err);
    // Safety check fallback on exact email match
    return email.toLowerCase() === ADMIN_EMAIL;
  }
}
