import { useState, useEffect } from 'react';
import { X, MessageSquare, Tag, CheckCircle2, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export default function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [item]);

  if (!item) return null;

  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const currentImage = images[activeImageIndex] || item.image;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const whatsappMessage = encodeURIComponent(
    `أهلاً DARK designer، شفت تصميم "${item.title}" في معرض الأعمال وحابب أطلب تصميم مشابه.`
  );
  const whatsappUrl = `https://wa.me/201035592514?text=${whatsappMessage}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#12121c] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-slate-900/80 border border-purple-500/30 text-white hover:text-purple-400 hover:bg-slate-900 transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Image Display Column */}
          <div className="lg:col-span-7 bg-slate-950 flex flex-col items-center justify-center relative min-h-[350px] lg:min-h-[500px] p-4 group">
            
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={currentImage}
                alt={item.title}
                className="w-full h-full object-contain max-h-[520px] rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Gallery Navigation Controls if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 border border-purple-500/30 text-white hover:bg-purple-600 transition-all"
                  aria-label="الصورة السابقة"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 border border-purple-500/30 text-white hover:bg-purple-600 transition-all"
                  aria-label="الصورة التالية"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Thumbnails list */}
                <div className="flex items-center gap-2 mt-3 z-20 overflow-x-auto max-w-full px-2 py-1">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-purple-500 scale-105 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md z-10">
              {item.categoryLabel}
            </div>
          </div>

          {/* Project Details Column */}
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6 bg-[#12121c]">
            
            <div className="space-y-4">
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                  {item.categoryLabel}
                </span>
                {item.year && (
                  <span className="text-xs text-slate-400 font-mono">سنة التنفيذ: {item.year}</span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white leading-snug">{item.title}</h3>

              {item.client && (
                <div className="text-xs text-purple-400 font-semibold">
                  العميل: <span className="text-slate-200">{item.client}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-purple-500/15 whitespace-pre-line">
                {item.description}
              </p>

              {/* Tools Used */}
              {item.tools && item.tools.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>أدوات التصميم المستخدمة:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tools.map((tl, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#181826] border border-purple-500/20 text-[11px] text-purple-200 font-mono">
                        {tl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features List */}
              {item.features && item.features.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-400">مميزات التسليم:</div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-purple-500/15 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:scale-[1.02] active:scale-98 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white/20" />
                <span>اطلب تصميم مشابه عبر واتساب</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <div className="text-[11px] text-center text-slate-400 pt-1">
                رقم المصمم المباشر: <span className="text-purple-300 font-bold font-mono dir-ltr inline-block">01035592514</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
