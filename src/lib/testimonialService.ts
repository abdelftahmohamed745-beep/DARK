import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Testimonial } from '../types';

const COLLECTION_NAME = 'testimonials';

export const subscribeToTestimonials = (
  callback: (items: Testimonial[]) => void,
  isAdmin: boolean = false
) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const allItems: Testimonial[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          role: data.role || '',
          text: data.text || '',
          rating: typeof data.rating === 'number' ? data.rating : 5,
          imageUrl: data.imageUrl || '',
          status: data.status || 'published',
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        };
      });

      const items = isAdmin
        ? allItems
        : allItems.filter((item) => item.status === 'published');
      callback(items);
    },
    (error) => {
      console.error('Testimonials listener error:', error);
      callback([]);
    }
  );
};

export const addTestimonial = async (
  item: Omit<Testimonial, 'id' | 'createdAt'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    name: item.name,
    role: item.role || '',
    text: item.text,
    rating: item.rating || 5,
    imageUrl: item.imageUrl || '',
    status: item.status || 'published',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTestimonial = async (
  id: string,
  data: Partial<Omit<Testimonial, 'id'>>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const updateData: Record<string, any> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.text !== undefined) updateData.text = data.text;
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.status !== undefined) updateData.status = data.status;

  await updateDoc(docRef, updateData);
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
