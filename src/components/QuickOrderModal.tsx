import { useState } from 'react';
import { X, Sparkles, MessageSquare, Clock, Check, Zap, AlertCircle } from 'lucide-react';
import { LOGO_STYLES, getLogoStyleLabel } from '../data/logoStyles';
import { addOrder } from '../lib/orderService';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export default function QuickOrderModal({ isOpen, onClose, defaultService }: QuickOrderModalProps) {
  if (!isOpen) return null;

  const [selectedCategory, setSelectedCategory] = useState(defaultService || 'تصميم اللوجوهات');
  const [logoStyle, setLogoStyle] = useState<string>('modern');
  const [logoStyleError, setLogoStyleError] = useState(false);
  const [quantity, setQuantity] = useState(3);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [includeSourceFiles, setIncludeSourceFiles] = useState(true);
  const [clientNotes, setClientNotes] = useState('');

  const rawPhone = '201035592514';

  const isLogoService =
    selectedCategory.includes('اللوجوهات') ||
    selectedCategory.includes('شعار') ||
    selectedCategory.includes('لوجو') ||
    selectedCategory.includes('الهوية');

  const calculateEstimate = () => {
    let basePerUnit = 0;
    if (selectedCategory.includes('السوشيال')) basePerUnit = 1;
    else if (selectedCategory.includes('اللوجوهات') || selectedCategory.includes('شعار')) basePerUnit = 2;
    else if (selectedCategory.includes('الهوية')) basePerUnit = 5;
    else basePerUnit = 2;

    const estDays = Math.max(1, Math.ceil((quantity * basePerUnit) / (expressDelivery ? 2 : 1)));
    return { days: estDays };
  };

  const est = calculateEstimate();

  const handleSendOrder = async () => {
    if (isLogoService && !logoStyle) {
      setLogoStyleError(true);
      return;
    }

    setLogoStyleError(false);

    const styleLabel = isLogoService && logoStyle ? getLogoStyleLabel(logoStyle) : 'غير ينطبق';

    // 1. Save to Firestore (Admin Dashboard)
    try {
      await addOrder({
        name: 'عميل حاسبة الطلب الفوري',
        phone: 'عبر واتساب مباشرة',
        serviceType: selectedCategory,
        logoStyle: isLogoService ? logoStyle : '',
        quantity,
        expressDelivery,
        includeSourceFiles,
        notes: clientNotes,
        status: 'new',
      });
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
    }

    // 2. Prepare WhatsApp text
    const text = encodeURIComponent(
      `أهلاً DARK designer، حابب أستفسر عن حجز تصميم بالتفاصيل التالية:\n\n` +
      `🎨 الخدمة: ${selectedCategory}\n` +
      (isLogoService ? `✨ ستايل اللوجو المطلوب: ${styleLabel}\n` : '') +
      `🔢 الكمية المطلوبة: ${quantity}\n` +
      `⚡ تسليم سريع (24-48 ساعة): ${expressDelivery ? 'نعم 🚀' : 'عادي'}\n` +
      `📁 إرفاق ملفات المصدر مفتوحة: ${includeSourceFiles ? 'نعم (PSD/AI)' : 'غير مطلوب'}\n` +
      `📝 ملاحظات إضافية: ${clientNotes || 'لا يوجد'}\n` +
      `⏱️ مدة التقدير المتوقعة: حوالي ${est.days} أيام`
    );

    // 3. Send email fallback to mohsenjake99@gmail.com
    const mailSubject = encodeURIComponent(`حاسبة الطلب الفوري: ${selectedCategory}`);
    const mailBody = encodeURIComponent(
      `طلب جديد من حاسبة الطلب الفوري بالموقع:\n\n` +
      `الخدمة: ${selectedCategory}\n` +
      (isLogoService ? `ستايل اللوجو: ${styleLabel}\n` : '') +
      `الكمية: ${quantity}\n` +
      `تسليم سريع: ${expressDelivery ? 'نعم' : 'عادي'}\n` +
      `ملفات المصدر: ${includeSourceFiles ? 'نعم' : 'لا'}\n` +
      `ملاحظات: ${clientNotes || 'لا يوجد'}`
    );

    const mailtoUrl = `mailto:mohsenjake99@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    const mailFrame = document.createElement('iframe');
    mailFrame.style.display = 'none';
    mailFrame.src = mailtoUrl;
    document.body.appendChild(mailFrame);
    setTimeout(() => document.body.removeChild(mailFrame), 1000);

    window.open(`https://wa.me/${rawPhone}?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#12121c] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-900/80 border border-purple-500/30 text-white hover:text-purple-400 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>حاسبة الطلب الفوري</span>
          </div>
          <h3 className="text-2xl font-black text-white">احسب تقدير طلبك واطلبه فوراً</h3>
          <p className="text-xs text-slate-400">حدد نوع وحجم مشروعك وسيتم تجهيز الرسالة مباشرة للمصمم.</p>
        </div>

        {/* Form Options */}
        <div className="space-y-4 text-right">
          
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">اختر نوع التصميم:</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {[
                'تصميم اللوجوهات',
                'الهوية البصرية المتكاملة',
                'تصاميم السوشيال ميديا',
                'البوسترات والإعلانات',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setLogoStyleError(false);
                  }}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                      : 'bg-[#181826] border-purple-500/20 text-slate-300 hover:border-purple-500/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Style Mandatory Selector if Logo/Branding service is chosen */}
          {isLogoService && (
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-right">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>ستايل اللوجو المطلوب</span>
                  <span className="text-purple-400 text-xs font-bold">(إجباري *)</span>
                </label>
                {logoStyle && (
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                    {LOGO_STYLES.find(s => s.id === logoStyle)?.label}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {LOGO_STYLES.map((style) => {
                  const isSelected = logoStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        setLogoStyle(style.id);
                        setLogoStyleError(false);
                      }}
                      className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-[#181826] border-purple-500/20 text-slate-300 hover:border-purple-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-[11px] text-white">
                          {style.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 stroke-[3]" />}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {style.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {logoStyleError && (
                <div className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-[11px] flex items-center gap-1.5 animate-bounce">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>يرجى اختار ستايل اللوجو قبل الإرسال.</span>
                </div>
              )}
            </div>
          )}

          {/* Quantity Counter */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">الكمية المطلوبة (عدد التصاميم/النماذج):</span>
              <span className="font-bold text-purple-400 font-mono text-sm">{quantity} تصاميم</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-purple-600 bg-slate-900 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Add-on Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            <button
              type="button"
              onClick={() => setExpressDelivery(!expressDelivery)}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                expressDelivery
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                  : 'bg-[#181826] border-purple-500/20 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>تسليم سريع مستعجل 🚀</span>
              </div>
              {expressDelivery && <Check className="w-4 h-4 text-purple-400" />}
            </button>

            <button
              type="button"
              onClick={() => setIncludeSourceFiles(!includeSourceFiles)}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                includeSourceFiles
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                  : 'bg-[#181826] border-purple-500/20 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>ملفات المصدر مفتوحة (PSD/AI)</span>
              </div>
              {includeSourceFiles && <Check className="w-4 h-4 text-purple-400" />}
            </button>

          </div>

          {/* Client Note */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-slate-300">أي ملاحظات خاصة؟</label>
            <input
              type="text"
              placeholder="مثال: ألوان الماركة بنفسجي وأسود، إطلاق الأسبوع القادم"
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181826] border border-purple-500/20 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Estimate Result Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>المدى الزمني المتوقع للتسليم:</span>
            </div>
            <span className="font-extrabold text-purple-300 text-sm">
              حوالي {est.days} أيام عمل
            </span>
          </div>

        </div>

        {/* Submit Order Button */}
        <button
          onClick={handleSendOrder}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-98 transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-white/20" />
          <span>إرسال هذا الطلب عبر واتساب مباشرة</span>
        </button>

      </div>
    </div>
  );
}
