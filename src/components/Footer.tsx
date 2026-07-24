import { MessageSquare, Instagram, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = encodeURIComponent('أهلاً DARK designer، حابب أستفسر عن تصميم.');
  const whatsappUrl = `https://wa.me/201035592514?text=${whatsappMessage}`;

  return (
    <footer className="bg-[#08080c] border-t border-purple-500/15 pt-16 pb-12 relative text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-800 p-[1px] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <div className="w-full h-full bg-[#0d0d14] rounded-[11px] flex items-center justify-center font-['Outfit'] font-black text-xl text-purple-400">
                  D
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-['Outfit'] font-black text-2xl tracking-wider text-white">
                  DARK <span className="text-purple-400 font-semibold text-base">designer</span>
                </span>
                <span className="text-xs text-purple-300/70 -mt-1">تصميمات احترافية تصنع فرقًا لعلامتك التجارية</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              نحن نحول الرؤى المبتكرة إلى تجارب بصرية استثنائية تعزز من قيمة علامتك التجارية وتجذب جمهورك المستهدف بكل فخامة وإتقان.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#141420] border border-purple-500/20 hover:border-purple-500 hover:bg-purple-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                title="واتساب"
              >
                <MessageSquare className="w-5 h-5" />
              </a>

              <a
                href="https://www.instagram.com/dark_designer7/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center transition-all group"
                title="إنستجرام @dark_designer7"
              >
                <Instagram className="w-5 h-5 text-purple-400 group-hover:text-white transition-colors" />
              </a>

              <a
                href="mailto:mohsenjake99@gmail.com"
                className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center transition-all group"
                title="البريد الإلكتروني"
              >
                <Mail className="w-5 h-5 text-purple-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-purple-500 pr-2">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-purple-300 transition-colors">الرئيسية</a></li>
              <li><a href="#about" className="hover:text-purple-300 transition-colors">من أنا</a></li>
              <li><a href="#services" className="hover:text-purple-300 transition-colors">خدماتي</a></li>
              <li><a href="#portfolio" className="hover:text-purple-300 transition-colors">معرض الأعمال</a></li>
              <li><a href="#why-us" className="hover:text-purple-300 transition-colors">لماذا تختارنا</a></li>
              <li><a href="#contact" className="hover:text-purple-300 transition-colors">تواصل معنا</a></li>
              <li>
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/admin');
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="hover:text-purple-300 transition-colors text-purple-400/80 hover:text-purple-300 font-semibold"
                >
                  لوحة التحكم (Admin)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-purple-500 pr-2">معلومات التواصل المباشر</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                <span className="block text-slate-500">رقم الهاتف والواتساب:</span>
                <a href="https://wa.me/201035592514" target="_blank" rel="noopener noreferrer" className="text-purple-300 font-bold font-mono text-sm dir-ltr inline-block hover:underline">
                  01035592514
                </a>
              </div>
              <div>
                <span className="block text-slate-500">البريد الإلكتروني:</span>
                <span className="text-slate-300 font-mono">mohsenjake99@gmail.com</span>
              </div>
              <div>
                <span className="block text-slate-500">ساعات العمل والتنفيذ:</span>
                <span className="text-emerald-400 font-semibold">متاح 7 أيام في الأسبوع</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright - Required text */}
        <div className="pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DARK designer. جميع الحقوق محفوظة.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141420] border border-purple-500/20 text-purple-300 hover:text-white hover:bg-purple-600 transition-all"
          >
            <span>أعلى الصفحة</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
