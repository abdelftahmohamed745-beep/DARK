import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';
import { PortfolioItem } from '../types';
import { CATEGORIES_MAP } from '../data/portfolio';

const COLLECTION_NAME = 'portfolio';

export interface UploadProgressCallback {
  (fileName: string, progress: number, downloadUrl?: string): void;
}

// Upload a single image file with progress tracking
export const uploadPortfolioImage = (
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `portfolio/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress(progress);
      },
      (error) => {
        console.error('Error uploading image to storage:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

// Delete an image from storage if it's a firebase storage URL
export const deleteStorageImageByUrl = async (url: string) => {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return;
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn('Failed to delete storage image:', err);
  }
};

// Real-time listener for portfolio projects
export const subscribeToPortfolio = (
  callback: (items: PortfolioItem[]) => void,
  isAdmin: boolean = false
) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const allItems: PortfolioItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const imagesList: string[] = data.images && data.images.length > 0
          ? data.images
          : [data.image || ''];

        return {
          id: docSnap.id,
          title: data.title || '',
          category: data.category || 'social',
          categoryLabel: CATEGORIES_MAP[data.category] || 'سوشيال ميديا',
          image: imagesList[0] || '',
          images: imagesList,
          description: data.description || '',
          client: data.client || '',
          year: data.year || '',
          tools: data.tools || [],
          features: data.features || [],
          published: data.published !== undefined ? Boolean(data.published) : true,
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        };
      });

      // Filter for public visitors (only show published items)
      const items = isAdmin ? allItems : allItems.filter((i) => i.published !== false);
      callback(items);
    },
    (error) => {
      console.error('Firestore portfolio subscription error:', error);
      callback([]);
    }
  );
};

// Add a new project
export const addProject = async (project: Omit<PortfolioItem, 'id'>) => {
  const primaryImage = project.images && project.images.length > 0 ? project.images[0] : project.image;
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    title: project.title,
    category: project.category,
    categoryLabel: CATEGORIES_MAP[project.category] || 'سوشيال ميديا',
    image: primaryImage,
    images: project.images || [primaryImage],
    description: project.description,
    client: project.client || '',
    year: project.year || '',
    tools: project.tools || [],
    features: project.features || [],
    published: project.published !== undefined ? project.published : true,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update an existing project
export const updateProject = async (
  id: string,
  project: Partial<PortfolioItem>
) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const primaryImage = project.images && project.images.length > 0 ? project.images[0] : project.image;

  const updateData: Record<string, any> = {};
  if (project.title !== undefined) updateData.title = project.title;
  if (project.category !== undefined) {
    updateData.category = project.category;
    updateData.categoryLabel = CATEGORIES_MAP[project.category] || 'سوشيال ميديا';
  }
  if (project.images !== undefined) {
    updateData.images = project.images;
    updateData.image = primaryImage;
  } else if (project.image !== undefined) {
    updateData.image = project.image;
  }
  if (project.description !== undefined) updateData.description = project.description;
  if (project.client !== undefined) updateData.client = project.client;
  if (project.year !== undefined) updateData.year = project.year;
  if (project.tools !== undefined) updateData.tools = project.tools;
  if (project.features !== undefined) updateData.features = project.features;
  if (project.published !== undefined) updateData.published = project.published;

  await updateDoc(docRef, updateData);
};

// Delete a project
export const deleteProject = async (id: string, imagesToDelete: string[] = []) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);

  // Clean up images from storage asynchronously
  imagesToDelete.forEach((url) => {
    deleteStorageImageByUrl(url);
  });
};
