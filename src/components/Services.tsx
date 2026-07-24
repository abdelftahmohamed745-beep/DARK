import { servicesData } from '../data/services';
import { Share2, PenTool, Layers, LayoutGrid, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Share2':
        return <Share2 className="w-7 h-7 text-purple-400" />;
      case 'PenTool':
        return <PenTool className="w-7 h-7 text-purple-400" />;
      case 'Layers':
        return <Layers className="w-7 h-7 text-purple-400" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-7 h-7 text-purple-400" />;
      default:
        return <Sparkles className="w-7 h-7 text-purple-400" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple-950/20 rounded-full blur-3xl pointer-events-none"></div>

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
            <Sparkles className="w-4 h-4" />
            <span>خدماتي الاحترافية</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ماذا <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">نقدم لعلامتك؟</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            خدمات تصميم جرافيك متكاملة مصممة خصيصاً لتلبي احتياجات نمو أعمالك وتضمن لك حضوراً بصرياً مباهراً.
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl bg-[#12121c] border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between p-7 group ${
                service.popular
                  ? 'border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.15)] bg-gradient-to-b from-[#141424] to-[#0f0f18]'
                  : 'border-purple-500/15 hover:border-purple-500/35 hover:shadow-xl'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold shadow-md">
                  الأكثر طلباً🔥
                </div>
              )}

              <div className="space-y-6">
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <div className="group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    {getIcon(service.iconName)}
                  </div>
                </div>

                {/* Service Title & Desc */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed min-h-[60px]">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-2 pt-3 border-t border-purple-500/15 text-xs text-slate-300">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-purple-500/10">
                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-3 px-4 rounded-xl bg-[#1a1a2a] border border-purple-500/30 hover:bg-purple-600 hover:border-purple-500 text-purple-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 group/btn cursor-pointer"
                >
                  <span>اطلب هذه الخدمة</span>
                  <ArrowLeft className="w-4 h-4 text-purple-400 group-hover/btn:text-white group-hover/btn:-translate-x-1 transition-all" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-[#12121c] to-indigo-950/50 border border-purple-500/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="space-y-2 text-center md:text-right">
            <h4 className="text-xl font-bold text-white">هل لديك طلب خاص أو فكرة تصميم غير مسبوقة؟</h4>
            <p className="text-sm text-slate-300">نحن هنا لتحويل أفكارك البصرية إلى واقع ملموس يتجاوز توقعاتك.</p>
          </div>
          <a
            href="https://wa.me/201035592514?text=%D8%A3%D9%87%D9%84%D8%A3%20DARK%20designer%D8%8C%20%D8%AD%D8%A7%D8%A8%D8%A8%20%D8%A3%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%8BD8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AE%D8%A7%D8%B5."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] whitespace-nowrap transition-all"
          >
            تحدث معنا مباشرة عبر واتساب
          </a>
        </motion.div>

      </div>
    </section>
  );
}
