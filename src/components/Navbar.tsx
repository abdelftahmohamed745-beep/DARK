import { useState, useEffect } from 'react';
import { Menu, X, MessageSquare, Sparkles, Send, Instagram, Zap, ZapOff } from 'lucide-react';

interface NavbarProps {
  onOpenQuickOrder?: () => void;
  isQuietMode?: boolean;
  onToggleQuietMode?: () => void;
}

export default function Navbar({ onOpenQuickOrder, isQuietMode = false, onToggleQuietMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'services', 'portfolio', 'why-us', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'الرئيسية' },
    { id: 'about', label: 'من أنا' },
    { id: 'services', label: 'الخدمات' },
    { id: 'portfolio', label: 'الأعمال' },
    { id: 'why-us', label: 'لماذا نحن' },
    { id: 'contact', label: 'تواصل' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappMessage = encodeURIComponent('أهلاً DARK designer، حابب أستفسر عن تصميم.');
  const whatsappUrl = `https://wa.me/201035592514?text=${whatsappMessage}`;

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0f]/90 backdrop-blur-md border-b border-purple-500/15 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 group text-right focus:outline-none"
            id="nav-logo-btn"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-950 p-[1px] shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300">
              <div className="w-full h-full bg-[#0d0d14] rounded-[11px] flex items-center justify-center relative overflow-hidden">
                <span className="font-['Outfit'] font-black text-xl text-purple-400 group-hover:scale-110 transition-transform">
                  D
                </span>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-['Outfit'] font-black text-xl tracking-wider text-white flex items-center gap-1">
                DARK <span className="text-purple-400 font-semibold text-sm">designer</span>
              </span>
              <span className="text-[10px] text-purple-300/70 -mt-1 font-medium">تصميم جرافيك محترف</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#12121a]/80 border border-purple-500/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                id={`nav-link-${link.id}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === link.id
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-slate-300 hover:text-purple-300 hover:bg-purple-500/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Motion Quiet Mode Toggle Button */}
            {onToggleQuietMode && (
              <button
                onClick={onToggleQuietMode}
                id="quiet-mode-toggle-btn"
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                  isQuietMode
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600/30'
                }`}
                title={isQuietMode ? 'تفعيل المؤثرات والحركة' : 'إيقاف الحركة (الوضع الهادئ)'}
              >
                {isQuietMode ? <ZapOff className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-purple-400" />}
              </button>
            )}

            <a
              href="https://www.instagram.com/dark_designer7/"
              target="_blank"
              rel="noopener noreferrer"
              id="header-instagram-cta"
              className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center group"
              title="إنستجرام @dark_designer7"
            >
              <Instagram className="w-4 h-4 text-purple-400 group-hover:text-white transition-colors" />
            </a>

            <button
              onClick={onOpenQuickOrder}
              id="header-quick-calc-btn"
              className="px-3.5 py-2 text-xs font-semibold text-purple-300 bg-purple-950/40 border border-purple-500/30 rounded-xl hover:bg-purple-900/40 hover:border-purple-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              حاسبة تكلفة المشروع
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="header-whatsapp-cta"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <MessageSquare className="w-4 h-4 fill-white/20 text-white" />
              <span>تواصل عبر واتساب</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="https://www.instagram.com/dark_designer7/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
              title="إنستجرام @dark_designer7"
            >
              <Instagram className="w-5 h-5 text-purple-400" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300"
              title="واتساب"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2.5 rounded-xl bg-[#161622] border border-purple-500/20 text-slate-200 hover:text-purple-400 focus:outline-none"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d14]/95 border-b border-purple-500/20 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 mt-2 shadow-2xl animate-in slide-in-from-top-5 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`py-2.5 px-4 rounded-xl text-right font-semibold text-sm transition-all ${
                  activeSection === link.id
                    ? 'bg-purple-600/30 border border-purple-500/40 text-purple-300 shadow-inner'
                    : 'bg-[#141420] text-slate-300 hover:bg-purple-900/20'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-purple-500/15 flex flex-col gap-2">
            {onToggleQuietMode && (
              <button
                onClick={() => {
                  onToggleQuietMode();
                }}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  isQuietMode
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                    : 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isQuietMode ? <ZapOff className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-purple-400" />}
                  <span>{isQuietMode ? 'الوضع الهادئ مفعل (الحركة متوقفة)' : 'تفعيل الوضع الهادئ (إيقاف الحركة)'}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 border border-purple-500/20">
                  {isQuietMode ? 'مفعل' : 'إيقاف'}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenQuickOrder) onOpenQuickOrder();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              احسب تكلفة تصميمك الآن
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <Send className="w-4 h-4" />
              <span>تواصل مباشر عبر واتساب (01035592514)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
