import { servicesData } from '../data/services';
import {
  Check,
  Sparkles,
  ArrowLeft,
  Shield,
  Gamepad2,
  Share2,
  Youtube,
  LayoutGrid,
  Tv,
  Layers,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-6 h-6 text-purple-400" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-purple-400" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-purple-400" />;
      case 'Youtube':
        return <Youtube className="w-6 h-6 text-purple-400" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-6 h-6 text-purple-400" />;
      case 'Tv':
        return <Tv className="w-6 h-6 text-purple-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-purple-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-900/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-extrabold tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>OUR SERVICES • خدماتنا الإبداعية</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            خدماتنا <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">الاحترافية</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            نقدم لك باقة شاملة من خدمات التصميم الجرافيكي والبصري بأعلى معايير الجودة العالمية لتطوير وحضور علامتك التجارية.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* 7 Services Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative rounded-2xl bg-[#12121c] border transition-all duration-300 flex flex-col justify-between p-6 group cursor-pointer ${
                service.popular
                  ? 'border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.15)] bg-gradient-to-b from-[#141426] to-[#0e0e18]'
                  : 'border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
              }`}
              onClick={() => onSelectService(service.titleAr || service.title)}
            >
              {service.popular && (
                <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                  <span>الأكثر طلباً🔥</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Header Row: Checkmark + Category Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-400 transition-all duration-300">
                    {getIcon(service.iconName)}
                  </div>

                  {/* Requested ✅ Checkmark Badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold group-hover:bg-purple-500/20 group-hover:text-white transition-all">
                    <span className="text-emerald-400 text-sm">✅</span>
                    <span className="text-[11px] font-mono">مضمون</span>
                  </div>
                </div>

                {/* Service Name & Titles */}
                <div className="space-y-1 pt-1">
                  <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors tracking-wide dir-ltr text-right">
                    {service.title}
                  </h3>
                  {service.titleAr && (
                    <div className="text-xs font-bold text-purple-400/90">
                      {service.titleAr}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed min-h-[42px]">
                  {service.shortDesc}
                </p>

                {/* Features list */}
                <ul className="space-y-2 pt-3 border-t border-purple-500/15 text-xs text-slate-300">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-purple-400 font-bold">✓</span>
                      <span className="text-slate-300 text-[11px]">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-5 border-t border-purple-500/15">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectService(service.titleAr || service.title);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1a1a2e] border border-purple-500/30 hover:bg-purple-600 hover:border-purple-500 text-purple-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 group/btn"
                >
                  <span>اطلب هذه الخدمة</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-purple-400 group-hover/btn:text-white group-hover/btn:-translate-x-1 transition-all" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* 3. Tagline Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#12121f] to-indigo-950/60 border border-purple-500/30 text-center shadow-lg"
        >
          <div className="text-sm sm:text-lg font-black text-white tracking-wide flex items-center justify-center gap-2 flex-wrap">
            <span>🚀 Professional Designs</span>
            <span className="text-purple-500">•</span>
            <span>Fast Delivery</span>
            <span className="text-purple-500">•</span>
            <span>High Quality</span>
          </div>
        </motion.div>

        {/* Bottom Contact Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#0f0f18] border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1 text-center md:text-right">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>هل تحتاج تصميم خاص أو مخصص لعلامتك التجارية؟</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">نحن جاهزون لتنفيذ أفكارك بالكامل بأفضل دقة وتسليم قياسي.</p>
          </div>
          <a
            href="https://wa.me/201035592514?text=%D8%A3%D9%87%D9%84%D8%A3%20DARK%20designer%D8%8C%20%D8%AD%D8%A7%D8%A8%D8%A8%20%D8%A3%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%8B%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AE%D8%A7%D8%B5."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] whitespace-nowrap transition-all hover:scale-105 active:scale-95"
          >
            تواصل معنا عبر واتساب
          </a>
        </motion.div>

      </div>
    </section>
  );
}

