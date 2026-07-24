import { User, Award, ShieldCheck, Clock, Layers, Flame, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutProps {
  onOpenQuickOrder: () => void;
}

export default function About({ onOpenQuickOrder }: AboutProps) {
  const stats = [
    { label: 'مشروع مكتمل', value: '+500', icon: Flame },
    { label: 'عميل سعيد', value: '+150', icon: User },
    { label: 'سنوات خبرة', value: '+5', icon: Award },
    { label: 'التزام بالمواعيد', value: '100%', icon: Clock },
  ];

  const tools = [
    { name: 'Adobe Photoshop', desc: 'دمج ومعالجة الصور المتقدمة' },
    { name: 'Adobe Illustrator', desc: 'الشعارات والجرافيك المتجهي' },
    { name: 'Adobe InDesign', desc: 'الكتالوجات ودلائل الهوية' },
    { name: 'Figma', desc: 'واجهات المستخدم والعرض التفاعلي' },
  ];

  return (
    <section id="about" className="py-24 bg-[#0c0c12] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <User className="w-4 h-4" />
            <span>نبذة عن المصمم</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            من <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">أنا؟</span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Profile Box */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 blur-xl opacity-30"></div>
              
              <div className="relative rounded-3xl bg-[#12121a] border border-purple-500/20 p-8 space-y-6 shadow-2xl">
                
                <div className="flex items-center gap-4 border-b border-purple-500/15 pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 p-[1px] shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <div className="w-full h-full bg-[#0d0d14] rounded-[15px] flex items-center justify-center font-['Outfit'] font-black text-2xl text-purple-400">
                      DARK
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-['Outfit']">DARK designer</h3>
                    <p className="text-xs text-purple-400 font-semibold">Senior Graphic Designer & Branding Specialist</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>مصمم موثوق ومحترف</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    متخصص في ابتكار وتطوير البصمة البصرية الشاملة للشركات والأفراد. تحويل الأفكار الجريئة إلى تحف جرافيكية ملموسة تترك أثراً دائماً.
                  </p>
                </div>

                {/* Direct Contact Info */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">الهاتف والواتساب:</span>
                    <a href="https://wa.me/201035592514" target="_blank" rel="noopener noreferrer" className="text-purple-300 font-bold font-mono text-sm hover:underline dir-ltr">
                      01035592514
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">حالة التوفر:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      جاهز للاستلام المباشر
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenQuickOrder}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer"
                >
                  <span>استفسر عن مشروعك الآن</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

              </div>
            </div>
          </motion.div>

          {/* Text Description Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                شغف التصميم البصري وصناعة التأثير لعلامتك التجارية
              </h3>
              
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                أنا <strong className="text-purple-300 font-bold">DARK designer</strong>، مصمم جرافيك محترف أملك خبرة طويلة في إنشاء <span className="text-purple-400 font-semibold">تصاميم السوشيال ميديا</span> المحفزة للتفاعل، <span className="text-purple-400 font-semibold">الشعارات المبتكرة</span>، <span className="text-purple-400 font-semibold">الهويات البصرية المتكاملة</span>، و<span className="text-purple-400 font-semibold">البوسترات والإعلانات</span> عالية الدقة.
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                أمنح مشروعك ميزة تنافسية حقيقية بفضل الرؤية الإبداعية المتجددة والقدرة على فهم متطلبات السوق العربي والعالمي. أعمل بشغف للوصول إلى أدق التفاصيل التي تُجسد روح عملك وتسهم في رفع نسبة مبيعاتك.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {stats.map((st, idx) => {
                const IconComponent = st.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="p-4 rounded-2xl bg-[#141420] border border-purple-500/15 hover:border-purple-500/40 transition-all text-center group"
                  >
                    <IconComponent className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">{st.value}</div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">{st.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Software Stack */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>برامج التصميم الاحترافية التي أتقنها:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tools.map((tl, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#101018] border border-purple-500/10 flex items-center gap-3"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{tl.name}</div>
                      <div className="text-[11px] text-slate-400">{tl.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
