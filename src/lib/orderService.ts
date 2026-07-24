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
import { OrderRequest } from '../types';

const COLLECTION_NAME = 'orders';

export const subscribeToOrders = (
  callback: (orders: OrderRequest[]) => void
) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: OrderRequest[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || 'عميل بدون اسم',
          phone: data.phone || '',
          email: data.email || '',
          serviceType: data.serviceType || 'غير محدد',
          logoStyle: data.logoStyle || '',
          quantity: data.quantity || 1,
          expressDelivery: !!data.expressDelivery,
          includeSourceFiles: !!data.includeSourceFiles,
          notes: data.notes || '',
          status: data.status || 'new',
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        };
      });
      callback(items);
    },
    (error) => {
      console.error('Orders listener error:', error);
      callback([]);
    }
  );
};

export const addOrder = async (order: OrderRequest): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    name: order.name,
    phone: order.phone,
    email: order.email || '',
    serviceType: order.serviceType,
    logoStyle: order.logoStyle || '',
    quantity: order.quantity || 1,
    expressDelivery: !!order.expressDelivery,
    includeSourceFiles: !!order.includeSourceFiles,
    notes: order.notes || '',
    status: 'new',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateOrderStatus = async (
  id: string,
  status: 'new' | 'contacted' | 'completed' | 'cancelled'
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
};

export const deleteOrder = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
