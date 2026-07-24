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

// Compress image via Canvas to optimize payload size if needed
export const compressImageIfNeeded = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('فشل قراءة ملف الصورة'));
        return;
      }
      // If SVG or small file < 400KB, return as is
      if (file.type.includes('svg') || file.size < 400 * 1024) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const compressedDataUrl = canvas.toDataURL(mimeType, 0.88);
            resolve(compressedDataUrl);
          } else {
            resolve(src);
          }
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

// Upload a single image file with fast progress tracking and instant fallback
export const uploadPortfolioImage = (
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let isCompleted = false;

    // Immediately trigger initial progress
    onProgress(15);

    // Fast local processing function with animated smooth progress bar
    const processFastLocalImage = async () => {
      if (isCompleted) return;
      try {
        let currentProgress = 20;
        onProgress(currentProgress);

        const progressInterval = setInterval(() => {
          currentProgress += 20;
          if (currentProgress <= 90) {
            onProgress(currentProgress);
          }
        }, 50);

        const dataUrl = await compressImageIfNeeded(file);
        clearInterval(progressInterval);

        if (!isCompleted) {
          isCompleted = true;
          onProgress(100);
          resolve(dataUrl);
        }
      } catch (err) {
        if (!isCompleted) {
          isCompleted = true;
          reject(err || new Error('فشل معالجة الصورة'));
        }
      }
    };

    // Try Firebase Storage upload with a short 300ms timeout before switching to fast local processing
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `portfolio/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      let hasProgressed = false;
      const timer = setTimeout(() => {
        if (!isCompleted && !hasProgressed) {
          try {
            uploadTask.cancel();
          } catch {
            // ignore
          }
          processFastLocalImage();
        }
      }, 350);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const rawProgress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            if (rawProgress > 0) {
              hasProgressed = true;
            }
            onProgress(Math.max(15, rawProgress));
          }
        },
        (error) => {
          clearTimeout(timer);
          if (!isCompleted) {
            processFastLocalImage();
          }
        },
        async () => {
          clearTimeout(timer);
          if (!isCompleted) {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              onProgress(100);
              isCompleted = true;
              resolve(downloadUrl);
            } catch {
              processFastLocalImage();
            }
          }
        }
      );
    } catch {
      processFastLocalImage();
    }
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
