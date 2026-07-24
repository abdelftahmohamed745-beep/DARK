import { MessageSquare } from 'lucide-react';

export default function FloatingWhatsApp() {
  const rawPhoneNumber = '201035592514';
  const message = encodeURIComponent('أهلاً DARK designer، حابب أستفسر عن تصميم.');
  const whatsappUrl = `https://wa.me/${rawPhoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 group">
      
      {/* Tooltip Badge */}
      <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0d0d14]/90 border border-purple-500/30 text-white text-xs font-bold shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 transition-transform">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>تحدث معي الآن على الواتساب</span>
      </div>

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_45px_rgba(168,85,247,0.9)] hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
        aria-label="تواصل عبر الواتساب"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute -inset-1 rounded-full bg-purple-500/40 animate-ping pointer-events-none"></span>

        <MessageSquare className="w-7 h-7 fill-white/20 group-hover/btn:rotate-12 transition-transform" />
      </a>

    </div>
  );
}
