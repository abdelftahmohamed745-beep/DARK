import { ArrowLeft, Sparkles, Eye, Send, Palette, Flame, Star } from 'lucide-react';
import { motion } from 'motion/react';
import heroBgImg from '../assets/images/dark_hero_bg_1784848080241.jpg';

interface HeroProps {
  onOpenQuickOrder: () => void;
}

export default function Hero({ onOpenQuickOrder }: HeroProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappMessage = encodeURIComponent('أهلاً DARK designer، حابب أستفسر عن تصميم.');
  const whatsappUrl = `https://wa.me/201035592514?text=${whatsappMessage}`;

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 flex items-center overflow-hidden bg-radial-purple">
      {/* Background Hero Image with Dark Gradient Mesh */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity">
        <img
          src={heroBgImg}
          alt="DARK designer background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
      </div>

      {/* Floating Glowing Neon Spheres */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-8 text-right"
          >
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/60 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
              <span className="text-xs sm:text-sm font-semibold text-purple-300">
                متاح الآن لاستلام مشاريع تصميم جديدة ✨
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-['Outfit'] tracking-tight text-white leading-none">
                <span className="block text-slate-100">DARK</span>
                <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.5)]">
                  designer
                </span>
              </h1>
              
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-200 leading-snug">
                تصميمات احترافية تصنع فرقًا لعلامتك التجارية.
              </h2>
            </div>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl font-normal">
              نصنع بصمتك البصرية الاستثنائية بلمسة داكنة فاخرة وأسلوب إبداعي لا يُنسى. من تصاميم السوشيال ميديا القوية إلى الشعارات والهويات التجارية الشاملة.
            </p>

            {/* CTA Buttons - Two Requested Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Button 1: شاهد أعمالي */}
              <button
                onClick={() => scrollTo('portfolio')}
                id="hero-view-portfolio-btn"
                className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white font-bold text-base shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_45px_rgba(168,85,247,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                <Eye className="w-5 h-5 text-purple-200 group-hover:scale-110 transition-transform" />
                <span>شاهد أعمالي</span>
                <ArrowLeft className="w-5 h-5 text-purple-200 group-hover:-translate-x-1.5 transition-transform" />
              </button>

              {/* Button 2: اطلب تصميمك الآن */}
              <button
                onClick={onOpenQuickOrder}
                id="hero-order-now-btn"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-[#141420] border border-purple-500/30 hover:border-purple-400/80 text-purple-200 font-bold text-base shadow-lg hover:bg-purple-950/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>اطلب تصميمك الآن</span>
              </button>
            </div>

            {/* Highlights Bar */}
            <div className="pt-8 border-t border-purple-500/15 grid grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] flex items-center gap-1">
                  <span>+500</span>
                  <Flame className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-xs sm:text-sm text-slate-400">تصميم ناجح</div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] flex items-center gap-1">
                  <span>100%</span>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                </div>
                <div className="text-xs sm:text-sm text-slate-400">رضا العملاء</div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] flex items-center gap-1">
                  <span>24/7</span>
                  <Send className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-xs sm:text-sm text-slate-400">دعم متواصل</div>
              </div>
            </div>

          </motion.div>

          {/* Graphic Design Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-2xl opacity-40 animate-pulse-glow"></div>

              {/* Interactive Design Showcase Canvas Card */}
              <div className="relative rounded-3xl bg-[#0f0f18]/90 border border-purple-500/30 p-6 shadow-2xl backdrop-blur-xl overflow-hidden group">
                
                {/* Header Mock Tool Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  </div>
                  <div className="text-xs font-mono text-purple-300/80 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/20">
                    DARK_STUDIO_ARTBOARD.psd
                  </div>
                </div>

                {/* Main Design Artboard Preview */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-purple-500/20 group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={heroBgImg}
                    alt="DARK designer visual art"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-transparent to-transparent"></div>

                  {/* Overlaid Vector Guides & Measurements */}
                  <div className="absolute inset-0 border border-dashed border-purple-400/30 pointer-events-none m-3 rounded-xl flex items-center justify-center">
                    <div className="text-center p-4 bg-slate-950/80 backdrop-blur-md rounded-xl border border-purple-500/40">
                      <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
                      <span className="text-xs font-bold text-white block">إبداع بلا حدود</span>
                      <span className="text-[10px] text-purple-300/70 block">300 DPI • CMYK / RGB Ready</span>
                    </div>
                  </div>
                </div>

                {/* Floating Software Badges */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-[#181826] border border-purple-500/20 text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Photoshop
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#181826] border border-purple-500/20 text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Illustrator
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#181826] border border-purple-500/20 text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    InDesign
                  </span>
                </div>

                {/* Bottom Order Bar inside Card */}
                <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    رقم الاتصال المباشر: <span className="text-purple-300 font-bold dir-ltr inline-block">01035592514</span>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 font-bold hover:underline flex items-center gap-1"
                  >
                    واتساب مباشر &larr;
                  </a>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
