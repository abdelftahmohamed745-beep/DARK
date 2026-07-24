import { useState, useEffect } from 'react';
import { PortfolioCategory, PortfolioItem } from '../types';
import PortfolioModal from './PortfolioModal';
import { Eye, Layers, Sparkles, FolderKanban, Loader2 } from 'lucide-react';
import { subscribeToPortfolio } from '../lib/portfolioService';
import { motion } from 'motion/react';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPortfolio((fetchedItems) => {
      setItems(fetchedItems);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'social', label: 'سوشيال ميديا' },
    { id: 'logo', label: 'لوجوهات' },
    { id: 'advertising', label: 'إعلانات' },
    { id: 'branding', label: 'هوية بصرية' },
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-[#0c0c14] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <Layers className="w-4 h-4" />
            <span>معرض الأعمال الحصرية</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            أحدث <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">الأعمال والتصاميم</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            تصفح باقة من أبرز المشاريع البصرية التي قمت بتصميمها لمختلف الماركات والعلامات التجارية.
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as PortfolioCategory)}
              id={`portfolio-filter-${cat.id}`}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105'
                  : 'bg-[#141422] border border-purple-500/15 text-slate-300 hover:text-purple-300 hover:border-purple-500/40 hover:bg-[#1a1a2e]'
              }`}
            >
              {activeCategory === cat.id && <Sparkles className="w-3.5 h-3.5 text-purple-200" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            <p className="text-slate-400 text-sm">جاري تحميل معرض الأعمال...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State in Arabic when there are no projects or none match category */
          <div className="py-20 px-6 max-w-2xl mx-auto text-center rounded-3xl bg-[#12121c] border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)] space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FolderKanban className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                لا توجد أعمال معروضة حاليًا — سيتم إضافة أعمال جديدة قريبًا.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                يمكنك التواصل معنا مباشرة لمناقشة فكرة مشروعك والاطلاع على نماذج أحدث أعمالنا الخاصة.
              </p>
            </div>
            <a
              href="https://wa.me/201035592514?text=%D8%A3%D9%87%D9%84%D8%A1%D9%8B%20DARK%20designer%D9%8E%D8%8C%20%D8%AD%D8%A7%D8%A8%D8%A8%20%D8%A3%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%A7%D9%84%D8%AA%D8%B5%D9%85%D9%8A%D9%85"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs hover:bg-purple-600 hover:text-white transition-all"
            >
              <span>تواصل معنا عبر واتساب</span>
            </a>
          </div>
        ) : (
          /* Portfolio Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl bg-[#12121c] border border-purple-500/20 overflow-hidden cursor-pointer hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 flex flex-col"
              >
                {/* Image Box */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Dark Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center space-y-2">
                      <span className="w-10 h-10 rounded-full bg-purple-600/90 text-white flex items-center justify-center mx-auto shadow-lg">
                        <Eye className="w-5 h-5" />
                      </span>
                      <span className="text-xs text-purple-200 font-bold block">انقر للتكبير والتفاصيل</span>
                    </div>
                  </div>

                  {/* Badge Category */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 border border-purple-500/30 text-purple-300 text-[11px] font-bold backdrop-blur-md">
                    {item.categoryLabel}
                  </div>

                  {/* Multiple images indicator badge */}
                  {item.images && item.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-purple-950/90 border border-purple-500/40 text-purple-200 text-[10px] font-mono backdrop-blur-md">
                      +{item.images.length} صور
                    </div>
                  )}
                </div>

                {/* Title & Desc */}
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-purple-500/10 flex items-center justify-between text-[11px] text-purple-400 font-semibold">
                    <span>طلب تصميم مشابه</span>
                    <span>معاينة &larr;</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Preview Component */}
      <PortfolioModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
