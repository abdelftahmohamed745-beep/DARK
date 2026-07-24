import { whyChooseData } from '../data/whyUs';
import { Award, Zap, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyChooseUs() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-8 h-8 text-purple-400" />;
      case 'Zap':
        return <Zap className="w-8 h-8 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-purple-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-8 h-8 text-purple-400" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-purple-400" />;
    }
  };

  return (
    <section id="why-us" className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

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
            <ShieldCheck className="w-4 h-4" />
            <span>قيم ومزايا العمل معنا</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            لماذا تختار <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">DARK designer؟</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            نحن لا نقدم مجرد تصاميم، بل نبني لك قيمة استثنائية تميزك عن منافسيك وتضمن نجاح رسالتك البصرية.
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* 4 Requested Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-3xl bg-[#12121e] border border-purple-500/15 hover:border-purple-500/40 p-8 space-y-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] group"
            >
              {/* Number Pill */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-300">
                  <div className="group-hover:text-white transition-colors">
                    {getIcon(item.iconName)}
                  </div>
                </div>
                <span className="text-3xl font-black font-['Outfit'] text-purple-500/30 group-hover:text-purple-400/80 transition-colors">
                  0{index + 1}
                </span>
              </div>

              {/* Title & Badge */}
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/20 text-[10px] font-bold text-purple-300">
                  {item.badgeText}
                </span>
                <h3 className="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Desc */}
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                {item.description}
              </p>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
