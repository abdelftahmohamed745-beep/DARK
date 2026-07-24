import React, { useState, useEffect, useRef } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { checkIsAdmin, ADMIN_EMAIL } from '../lib/userService';
import { validateImageFile } from '../lib/security';
import { PortfolioItem, PortfolioCategory, OrderRequest } from '../types';
import {
  subscribeToPortfolio,
  addProject,
  updateProject,
  deleteProject,
  uploadPortfolioImage,
  deleteStorageImageByUrl,
} from '../lib/portfolioService';
import { subscribeToOrders, updateOrderStatus, deleteOrder } from '../lib/orderService';
import { LOGO_STYLES, getLogoStyleLabel } from '../data/logoStyles';
import { CATEGORIES_MAP } from '../data/portfolio';
import {
  Plus,
  Trash2,
  Edit3,
  LogOut,
  ExternalLink,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Sparkles,
  Layers,
  FolderPlus,
  Eye,
  EyeOff,
  Inbox,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  Check,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onViewSite: () => void;
}

interface ImageUploadItem {
  id: string;
  file?: File;
  url?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export default function AdminDashboard({ user, onViewSite }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'portfolio'>('orders');

  // Orders State
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Portfolio State
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'social' | 'logo' | 'advertising' | 'branding'>('social');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [toolsInput, setToolsInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [published, setPublished] = useState(true);

  // Image Upload Items state
  const [imageUploads, setImageUploads] = useState<ImageUploadItem[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm Modal
  const [deletingProject, setDeletingProject] = useState<PortfolioItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security check: Ensure only mohsenjake99@gmail.com with admin role can view dashboard
  useEffect(() => {
    const verifyAccess = async () => {
      if (user) {
        const isAdmin = await checkIsAdmin(user.uid, user.email);
        if (!isAdmin) {
          await signOut(auth);
        }
      }
    };
    verifyAccess();
  }, [user]);

  // Subscribe to real-time portfolio updates (isAdmin = true to see unpublished items)
  useEffect(() => {
    const unsubscribe = subscribeToPortfolio((items) => {
      setProjects(items);
      setLoadingProjects(false);
    }, true);
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time orders updates from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToOrders((items) => {
      setOrders(items);
      setLoadingOrders(false);
    });
    return () => unsubscribe();
  }, []);

  // Open modal for adding new project
  const handleOpenAddModal = () => {
    setEditingProjectId(null);
    setTitle('');
    setCategory('social');
    setDescription('');
    setClient('');
    setYear(new Date().getFullYear().toString());
    setToolsInput('');
    setFeaturesInput('');
    setPublished(true);
    setImageUploads([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing project
  const handleOpenEditModal = (project: PortfolioItem) => {
    setEditingProjectId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setDescription(project.description);
    setClient(project.client || '');
    setYear(project.year || new Date().getFullYear().toString());
    setToolsInput((project.tools || []).join(', '));
    setFeaturesInput((project.features || []).join('\n'));
    setPublished(project.published !== false);
    setFormError(null);

    // Populate existing images
    const existingImages = project.images && project.images.length > 0 ? project.images : [project.image];
    setImageUploads(
      existingImages.map((url, idx) => ({
        id: `existing_${idx}_${Date.now()}`,
        url: url,
        progress: 100,
        status: 'completed',
      }))
    );

    setIsModalOpen(true);
  };

  // Toggle publish status directly from list
  const handleTogglePublish = async (project: PortfolioItem) => {
    try {
      await updateProject(project.id, { published: !project.published });
    } catch (err) {
      console.error('Failed to toggle publish state:', err);
    }
  };

  // Handle files selected for upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files) as File[];
    
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error || 'الملف المرفق غير صالح.');
        continue;
      }

      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      
      const newUploadItem: ImageUploadItem = {
        id: uploadId,
        file,
        progress: 0,
        status: 'uploading',
      };

      setImageUploads((prev) => [...prev, newUploadItem]);

      try {
        const downloadUrl = await uploadPortfolioImage(file, (progress) => {
          setImageUploads((prev) =>
            prev.map((item) => (item.id === uploadId ? { ...item, progress } : item))
          );
        });

        setImageUploads((prev) =>
          prev.map((item) =>
            item.id === uploadId
              ? { ...item, url: downloadUrl, progress: 100, status: 'completed' }
              : item
          )
        );
      } catch (err: any) {
        console.error('Failed file upload:', err);
        setImageUploads((prev) =>
          prev.map((item) =>
            item.id === uploadId
              ? { ...item, status: 'error', error: 'فشل رفع الصورة' }
              : item
          )
        );
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Delete an image from the current upload list
  const handleRemoveImageItem = async (itemId: string, url?: string) => {
    setImageUploads((prev) => prev.filter((item) => item.id !== itemId));
    // Optionally delete from storage if it's already uploaded
    if (url) {
      deleteStorageImageByUrl(url);
    }
  };

  // Save project (add or edit)
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('يرجى كتابة عنوان المشروع');
      return;
    }

    if (!description.trim()) {
      setFormError('يرجى كتابة وصف المشروع');
      return;
    }

    const completedUrls = imageUploads
      .filter((item) => item.status === 'completed' && item.url)
      .map((item) => item.url as string);

    if (completedUrls.length === 0) {
      setFormError('يرجى رفع صورة واحدة على الأقل للمشروع');
      return;
    }

    // Check if any uploads are still in progress
    const isStillUploading = imageUploads.some((item) => item.status === 'uploading');
    if (isStillUploading) {
      setFormError('يرجى الانتظار حتى اكتمال رفع جميع الصور جارٍ رفعها');
      return;
    }

    setSubmitting(true);

    try {
      const toolsArray = toolsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const featuresArray = featuresInput
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      if (editingProjectId) {
        await updateProject(editingProjectId, {
          title: title.trim(),
          category,
          description: description.trim(),
          client: client.trim(),
          year: year.trim(),
          tools: toolsArray,
          features: featuresArray,
          published,
          images: completedUrls,
          image: completedUrls[0],
        });
      } else {
        await addProject({
          title: title.trim(),
          category,
          categoryLabel: CATEGORIES_MAP[category],
          description: description.trim(),
          client: client.trim(),
          year: year.trim(),
          tools: toolsArray,
          features: featuresArray,
          published,
          images: completedUrls,
          image: completedUrls[0],
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving project:', err);
      setFormError('حدث خطأ أثناء حفظ المشروع: ' + (err.message || 'خطأ في الاتصال'));
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm and delete project
  const handleConfirmDeleteProject = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);

    try {
      const imagesToDelete = deletingProject.images || [deletingProject.image];
      await deleteProject(deletingProject.id, imagesToDelete);
      setDeletingProject(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('حدث خطأ أثناء حذف المشروع');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Filter projects by search query and category
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 dir-rtl font-['IBM_Plex_Sans_Arabic','Cairo',sans-serif]">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c14]/90 backdrop-blur-md border-b border-purple-500/20 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-black text-white flex items-center gap-2">
                <span>لوحة تحكم DARK Designer</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                  آدمين
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                المسؤول الحالي: <span className="text-purple-300 font-mono">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onViewSite}
              className="px-4 py-2 rounded-xl bg-[#141422] border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-500/50 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              <span>معاينة الموقع الرئيسي</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs (Orders vs Portfolio) */}
        <div className="flex items-center gap-3 border-b border-purple-500/20 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-[#10101a] border border-purple-500/20 text-slate-400 hover:text-white hover:border-purple-500/40'
            }`}
          >
            <Inbox className="w-4 h-4 text-purple-300" />
            <span>طلبات العملاء واللوجوهات</span>
            {orders.filter(o => o.status === 'new').length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[11px] font-black border border-purple-500/40 animate-pulse">
                {orders.filter(o => o.status === 'new').length} جديد
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'portfolio'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-[#10101a] border border-purple-500/20 text-slate-400 hover:text-white hover:border-purple-500/40'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-300" />
            <span>إدارة معرض الأعمال (البورتفوليو)</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[11px] font-bold">
              {projects.length}
            </span>
          </button>
        </div>

        {/* TAB 1: ORDERS DASHBOARD */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Header Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#10101a] border border-purple-500/20 flex flex-col justify-between space-y-2">
                <span className="text-xs text-slate-400 font-bold">إجمالي الطلبات</span>
                <span className="text-2xl font-black text-white">{orders.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#10101a] border border-purple-500/30 flex flex-col justify-between space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-300 font-extrabold">طلبات جديدة</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
                </div>
                <span className="text-2xl font-black text-purple-300">
                  {orders.filter(o => o.status === 'new').length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#10101a] border border-indigo-500/20 flex flex-col justify-between space-y-2">
                <span className="text-xs text-indigo-300 font-bold">تم التواصل</span>
                <span className="text-2xl font-black text-indigo-300">
                  {orders.filter(o => o.status === 'contacted').length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#10101a] border border-emerald-500/20 flex flex-col justify-between space-y-2">
                <span className="text-xs text-emerald-300 font-bold">مكتملة</span>
                <span className="text-2xl font-black text-emerald-300">
                  {orders.filter(o => o.status === 'completed').length}
                </span>
              </div>
            </div>

            {/* Order Status Filters */}
            <div className="flex items-center justify-between gap-4 flex-wrap bg-[#10101a] border border-purple-500/20 p-3 rounded-2xl">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-slate-400 font-bold shrink-0 ml-2">تصفية حسب الحالة:</span>
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'new', label: 'جديد' },
                  { id: 'contacted', label: 'تم التواصل' },
                  { id: 'completed', label: 'مكتمل' },
                  { id: 'cancelled', label: 'ملغى' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderFilterStatus(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      orderFilterStatus === st.id
                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-[#181826] text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards List */}
            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                <p className="text-slate-400 text-xs">جاري تحميل طلبات العملاء...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#101018] border border-purple-500/15 rounded-3xl space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Inbox className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">لا توجد طلبات مسجلة حاليًا</h3>
                  <p className="text-xs text-slate-400">
                    عندما يقوم الزوار بإرسال طلبات اللوجو والتصميم عبر الموقع، ستظهر التفاصيل هنا فورًا.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders
                  .filter((o) => orderFilterStatus === 'all' || o.status === orderFilterStatus)
                  .map((order) => {
                    const logoStyleInfo = order.logoStyle ? getLogoStyleLabel(order.logoStyle) : null;
                    const dateStr = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'منذ قليل';

                    return (
                      <div
                        key={order.id}
                        className={`p-5 rounded-2xl bg-[#12121e] border transition-all space-y-4 relative overflow-hidden ${
                          order.status === 'new'
                            ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] bg-gradient-to-b from-[#161326] to-[#12121e]'
                            : 'border-purple-500/20'
                        }`}
                      >
                        {/* Top Badge & Date */}
                        <div className="flex items-center justify-between gap-2 border-b border-purple-500/15 pb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                                order.status === 'new'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                                  : order.status === 'contacted'
                                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                                  : order.status === 'completed'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-slate-900 text-slate-400'
                              }`}
                            >
                              {order.status === 'new'
                                ? '✨ طلب جديد'
                                : order.status === 'contacted'
                                ? '💬 تم التواصل'
                                : order.status === 'completed'
                                ? '✅ مكتمل'
                                : '❌ ملغى'}
                            </span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{dateStr}</span>
                            </span>
                          </div>

                          <button
                            onClick={async () => {
                              if (order.id && confirm('هل أنت تأكد من حذف هذا الطلب؟')) {
                                await deleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-1">
                          <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                            <span>{order.name}</span>
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                            {order.phone && (
                              <span className="flex items-center gap-1 dir-ltr text-purple-300 font-mono">
                                <Phone className="w-3 h-3 text-purple-400" />
                                <span>{order.phone}</span>
                              </span>
                            )}
                            {order.email && (
                              <span className="flex items-center gap-1 text-slate-400 font-mono">
                                <Mail className="w-3 h-3 text-indigo-400" />
                                <span>{order.email}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Service & Mandatory Logo Style Display */}
                        <div className="p-3.5 rounded-xl bg-[#181828] border border-purple-500/20 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-bold">نوع الخدمة:</span>
                            <span className="text-purple-300 font-extrabold">{order.serviceType}</span>
                          </div>

                          {logoStyleInfo && (
                            <div className="pt-2 border-t border-purple-500/10 flex items-start justify-between gap-2">
                              <span className="text-xs text-slate-300 font-extrabold flex items-center gap-1 shrink-0">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                <span>ستايل اللوجو المطلوب:</span>
                              </span>
                              <span className="text-xs font-black text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2.5 py-1 rounded-lg text-left">
                                {logoStyleInfo}
                              </span>
                            </div>
                          )}

                          {order.quantity && order.quantity > 1 && (
                            <div className="text-xs text-slate-400">
                              الكمية: <span className="text-white font-mono">{order.quantity}</span> تصاميم
                            </div>
                          )}

                          {order.notes && (
                            <div className="text-xs text-slate-300 pt-1 border-t border-purple-500/10">
                              <span className="text-slate-400 font-bold">ملاحظات العميل: </span>
                              <span>{order.notes}</span>
                            </div>
                          )}
                        </div>

                        {/* Status Switcher & WhatsApp Action */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-slate-500 font-bold ml-1">تغيير الحالة:</span>
                            {(['new', 'contacted', 'completed', 'cancelled'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => order.id && updateOrderStatus(order.id, st)}
                                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                                  order.status === st
                                    ? 'bg-purple-600 text-white font-bold'
                                    : 'bg-slate-900 text-slate-400 hover:text-white'
                                }`}
                              >
                                {st === 'new'
                                  ? 'جديد'
                                  : st === 'contacted'
                                  ? 'تواصل'
                                  : st === 'completed'
                                  ? 'مكتمل'
                                  : 'ملغى'}
                              </button>
                            ))}
                          </div>

                          {order.phone && order.phone !== 'عبر واتساب مباشرة' && (
                            <a
                              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `أهلاً ${order.name}، معك DARK Designer بخصوص طلبك (${order.serviceType})...`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>مراسلة واتساب</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PORTFOLIO MANAGEMENT */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            {/* Controls Header & Action */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#101018] border border-purple-500/20 rounded-2xl p-4 sm:p-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>إدارة معرض الأعمال</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </h2>
                <p className="text-xs text-slate-400">
                  إضافة وتعديل وحذف مشاريع البورتفوليو المعروضة للزوار في الوقت الفعلي
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مشروع جديد</span>
              </button>
            </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالاسم أو العميل أو الوصف..."
              className="w-full py-2.5 px-4 pr-10 rounded-xl bg-[#0a0a10] border border-purple-500/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
            <Search className="w-4 h-4 text-purple-400 absolute top-3 right-3" />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-[#12121e] border border-purple-500/15 text-slate-400 hover:text-white'
              }`}
            >
              الكل ({projects.length})
            </button>
            {Object.entries(CATEGORIES_MAP).map(([catKey, catLabel]) => {
              const count = projects.filter((p) => p.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === catKey
                      ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : 'bg-[#12121e] border border-purple-500/15 text-slate-400 hover:text-white'
                  }`}
                >
                  {catLabel} ({count})
                </button>
              );
            })}
          </div>

        </div>

        {/* Projects Grid List */}
        {loadingProjects ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-slate-400 text-xs">جاري تحميل المشاريع من قاعدة البيانات...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#101018] border border-purple-500/15 rounded-3xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FolderPlus className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">لا توجد مشاريع مضافة حاليًا</h3>
              <p className="text-xs text-slate-400">
                انقر على زر "إضافة مشروع جديد" لرفع تصاميمك الأولى إلى البورتفوليو.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مشروع جديد الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#12121c] border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                        {project.categoryLabel}
                      </span>
                      {project.published !== false ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> منشور
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> مخفي
                        </span>
                      )}
                    </div>
                    {project.images && project.images.length > 1 && (
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/30 text-purple-200 text-[10px] font-mono">
                        {project.images.length} صور
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{project.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    {project.client && (
                      <div className="text-[11px] text-purple-400">العميل: {project.client}</div>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="p-3 bg-[#0a0a12] border-t border-purple-500/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTogglePublish(project)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      project.published !== false
                        ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60'
                        : 'bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/60'
                    }`}
                    title={project.published !== false ? 'إخفاء من المعرض' : 'إظهار في المعرض'}
                  >
                    {project.published !== false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(project)}
                    className="flex-1 py-2 px-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => setDeletingProject(project)}
                    className="py-2 px-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
          </div>
        )}

      </main>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#12121c] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>{editingProjectId ? 'تعديل بيانات المشروع' : 'إضافة مشروع جديد للبورتفوليو'}</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </h3>
              <p className="text-xs text-slate-400">
                أدخل تفاصيل المشروع وارفع الصور بدقة عالية
              </p>
            </div>

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProject} className="space-y-5">
              
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    عنوان المشروع *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: تصاميم سوشيال ميديا لمطعم X"
                    required
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#0a0a10] border border-purple-500/20 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    فئة التصميم *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#0a0a10] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="social">سوشيال ميديا</option>
                    <option value="logo">لوجوهات</option>
                    <option value="advertising">إعلانات</option>
                    <option value="branding">هوية بصرية</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  الوصف والتفاصيل *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="اكتب وصفًا مختصرًا ومميزًا للعميل أو فكرة التصميم..."
                  required
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#0a0a10] border border-purple-500/20 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Client & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    اسم العميل (اختياري)
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="مثال: شركة النور العالمية"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#0a0a10] border border-purple-500/20 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    سنة التنفيذ
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#0a0a10] border border-purple-500/20 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Tools Used */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  أدوات التصميم المستخدمة (فصل بينها بفاصلة)
                </label>
                <input
                  type="text"
                  value={toolsInput}
                  onChange={(e) => setToolsInput(e.target.value)}
                  placeholder="Photoshop, Illustrator, Cinema 4D"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#0a0a10] border border-purple-500/20 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Features List */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  مميزات التسليم (كل ميزة في سطر)
                </label>
                <textarea
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  rows={2}
                  placeholder={'3 تصاميم قياسية للبوست\nملفات PSD مفتوحة المصدر'}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#0a0a10] border border-purple-500/20 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Publish Toggle */}
              <div className="p-3.5 rounded-xl bg-[#0a0a10] border border-purple-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">حالة النشر في المعرض العام</div>
                  <div className="text-[11px] text-slate-400">عند تفعيلها يظهر المشروع لزوار الموقع فورًا</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  صور المشروع (يمكن اختيار أكثر من صورة) *
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-500/30 hover:border-purple-500 rounded-2xl p-6 text-center bg-[#0a0a10] hover:bg-purple-950/20 transition-all cursor-pointer group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-200">
                    اضغط هنا لرفع الصور أو اسحب الصور هنا
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    يدعم جميع صيغ الصور (PNG, JPG, WEBP)
                  </p>
                </div>

                {/* Uploaded Images List & Progress Bars */}
                {imageUploads.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {imageUploads.map((imgItem) => (
                      <div
                        key={imgItem.id}
                        className="bg-[#0a0a12] border border-purple-500/20 rounded-xl p-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {imgItem.url ? (
                            <img
                              src={imgItem.url}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover bg-black border border-purple-500/30 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <ImageIcon className="w-5 h-5 text-purple-400" />
                            </div>
                          )}

                          <div className="overflow-hidden space-y-1 flex-1">
                            <p className="text-xs text-white truncate font-mono">
                              {imgItem.file?.name || 'صورة مرفوعة'}
                            </p>

                            {/* Progress bar */}
                            {imgItem.status === 'uploading' && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-purple-300 font-mono">
                                  <span>جارٍ الرفع...</span>
                                  <span>{imgItem.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-purple-500 h-full transition-all duration-200"
                                    style={{ width: `${imgItem.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {imgItem.status === 'completed' && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                                <CheckCircle2 className="w-3 h-3" /> تم الرفع بنجاح
                              </span>
                            )}

                            {imgItem.status === 'error' && (
                              <span className="text-[10px] text-red-400 font-bold">
                                {imgItem.error || 'خطأ في الرفع'}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveImageItem(imgItem.id, imgItem.url)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors shrink-0 cursor-pointer"
                          title="حذف هذه الصورة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-purple-500/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#141422] border border-purple-500/20 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>{editingProjectId ? 'حفظ التغييرات' : 'نشر المشروع'}</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#12121c] border border-red-500/30 rounded-3xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">تأكيد حذف المشروع</h4>
              <p className="text-xs text-slate-400">
                هل أنت تأكد من رغبتك في حذف مشروع <span className="text-white font-bold">"{deletingProject.title}"</span>؟ سيتم مسح جميع بياناته وصوره من البورتفوليو نهائيًا.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProject(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#141422] border border-purple-500/20 text-slate-300 text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmDeleteProject}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <span>حذف نهائيًا</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
