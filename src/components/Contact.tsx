import { useState, FormEvent } from 'react';
import { Send, MessageSquare, Phone, Mail, Instagram, CheckCircle, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ContactFormData } from '../types';
import { LOGO_STYLES, getLogoStyleLabel } from '../data/logoStyles';
import { addOrder } from '../lib/orderService';
import { motion } from 'motion/react';

interface ContactProps {
  preselectedService?: string;
}

export default function Contact({ preselectedService }: ContactProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    serviceType: preselectedService || 'تصميم اللوجوهات',
    logoStyle: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoStyleError, setLogoStyleError] = useState(false);

  const phoneDisplay = '01035592514';
  const rawPhoneNumber = '201035592514';
  const defaultWhatsAppText = encodeURIComponent('أهلاً DARK designer، حابب أستفسر عن تصميم.');
  const whatsappUrl = `https://wa.me/${rawPhoneNumber}?text=${defaultWhatsAppText}`;

  const isLogoService =
    formData.serviceType.includes('اللوجوهات') ||
    formData.serviceType.includes('شعار') ||
    formData.serviceType.includes('Logo') ||
    formData.serviceType.includes('الهوية') ||
    formData.serviceType.includes('Brand');

  const isSocialService = formData.serviceType.includes('السوشيال');
  const isPosterService = formData.serviceType.includes('البوسترات') || formData.serviceType.includes('إعلانات');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLogoService && !formData.logoStyle) {
      setLogoStyleError(true);
      return;
    }

    setLogoStyleError(false);
    setIsSubmitting(true);

    const styleInfo = formData.logoStyle ? getLogoStyleLabel(formData.logoStyle) : 'غير ينطبق';

    // 1. Save Order to Firestore (Admin Dashboard)
    try {
      await addOrder({
        name: formData.name || 'عميل جديد',
        phone: formData.phone,
        email: formData.email,
        serviceType: formData.serviceType,
        logoStyle: isLogoService ? formData.logoStyle : '',
        notes: formData.message,
        status: 'new',
      });
    } catch (err) {
      console.error('Error saving order to database:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);

    // 2. Format prefilled WhatsApp message with form details
    const customText = encodeURIComponent(
      `أهلاً DARK designer، حابب أطلب تصميم جديد:\n\n` +
      `📌 التفاصيل الأساسية:\n` +
      `- الاسم: ${formData.name || 'غير محدد'}\n` +
      `- الهاتف: ${formData.phone || 'غير محدد'}\n` +
      `- البريد: ${formData.email || 'غير محدد'}\n` +
      `- نوع الخدمة: ${formData.serviceType}\n` +
      (isLogoService ? `- 🎨 ستايل اللوجو المفضل: ${styleInfo}\n` : '') +
      `- تفاصيل وفكرة المشروع: ${formData.message || 'لا يوجد'}`
    );

    // 3. Prepare mailto fallback to send copy to admin email mohsenjake99@gmail.com
    const emailSubject = encodeURIComponent(`طلب جديد: ${formData.serviceType} - ${formData.name}`);
    const emailBody = encodeURIComponent(
      `طلب تصميم جديد من الموقع الرسمي:\n\n` +
      `الاسم: ${formData.name}\n` +
      `الهاتف: ${formData.phone}\n` +
      `البريد الإلكتروني: ${formData.email}\n` +
      `نوع الخدمة: ${formData.serviceType}\n` +
      (isLogoService ? `ستايل اللوجو المختار: ${styleInfo}\n` : '') +
      `تفاصيل الطلب: ${formData.message}`
    );

    const mailtoUrl = `mailto:mohsenjake99@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    
    setTimeout(() => {
      const mailFrame = document.createElement('iframe');
      mailFrame.style.display = 'none';
      mailFrame.src = mailtoUrl;
      document.body.appendChild(mailFrame);
      setTimeout(() => document.body.removeChild(mailFrame), 1000);

      window.open(`https://wa.me/${rawPhoneNumber}?text=${customText}`, '_blank');
    }, 600);
  };

  return (
    <section id="contact" className="py-24 bg-[#0c0c14] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title - Required */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>ابدأ الآن</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            جاهز تبدأ <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">مشروعك؟</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            أرسل تفاصيل مشروعك اليوم، وسنتواصل معك فوراً لمناقشة أفكارك وتحويلها لواقع بصرى مميز.
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Direct Channels Cards (WhatsApp, Phone, Instagram, Email) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Primary WhatsApp Card - Required */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 via-[#121220] to-[#0d0d16] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <MessageSquare className="w-7 h-7 fill-white/20" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">تواصل سريع عبر واتساب</h3>
                  <p className="text-xs text-purple-300">رد فوري ومباشر على مدار الساعة</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                اضغط على الزر أدناه للتواصل المباشر مع المصمم ومناقشة تفاصيل وأسعار تصميمك فوراً.
              </p>

              {/* Required WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-whatsapp-btn"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:scale-[1.02] active:scale-98 transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-white/30" />
                <span>تواصل عبر واتساب</span>
              </a>

              <div className="text-xs text-center text-slate-400">
                الرقم المباشر: <span className="text-purple-300 font-bold font-mono text-sm dir-ltr inline-block">{phoneDisplay}</span>
              </div>
            </div>

            {/* Other Contact Details List */}
            <div className="p-6 rounded-3xl bg-[#12121a] border border-purple-500/15 space-y-4">
              
              {/* Phone Displayed - Required */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#181826] border border-purple-500/10">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">رقم الهاتف والتواصل:</div>
                  <a href={`tel:${phoneDisplay}`} className="text-sm font-bold text-white font-mono dir-ltr inline-block hover:text-purple-300">
                    {phoneDisplay}
                  </a>
                </div>
              </div>

              {/* Instagram Button / Link - Required */}
              <a
                href="https://www.instagram.com/dark_designer7/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#181826] border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-950/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400">انستغرام المعرض الرسمي:</div>
                  <div className="text-sm font-bold text-purple-300 group-hover:text-white group-hover:underline dir-ltr text-right font-mono">
                    @dark_designer7
                  </div>
                </div>
              </a>

              {/* Email Button with Copy Option */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181826] border border-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">البريد الإلكتروني الرسمي:</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200 font-mono">
                      mohsenjake99@gmail.com
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('mohsenjake99@gmail.com');
                    alert('تم نسخ البريد الإلكتروني بنجاح!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600 text-xs font-bold transition-all cursor-pointer"
                >
                  نسخ البريد
                </button>
              </div>

            </div>

          </motion.div>

          {/* Contact Form Column - Required Fields: الاسم، رقم الهاتف، البريد الإلكتروني، نوع الخدمة، تفاصيل الطلب */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-[#12121c] border border-purple-500/20 shadow-2xl space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">نموذج الطلب المباشر</h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  املأ البيانات وسيقوم المصمم بتحضير عرض السعر والافكار المناسبة لمشروعك.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-purple-600/30 border border-purple-500 flex items-center justify-center mx-auto text-purple-300">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-white">تم استلام بيانات طلبك بنجاح!</h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    جاري فتح تطبيق الواتساب لنقل التفاصيل مباشرة للمصمم. إذا لم يفتح تلقائياً، اضغط على الزر أدناه.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    <span>فتح الواتساب الآن</span>
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Field 1: الاسم */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      الاسم الكامل <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الكريم"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#181826] border border-purple-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  {/* Grid for Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Field 2: رقم الهاتف */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        رقم الهاتف / الواتساب <span className="text-purple-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="010XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#181826] border border-purple-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-right dir-rtl"
                      />
                    </div>

                    {/* Field 3: البريد الإلكتروني */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#181826] border border-purple-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      />
                    </div>

                  </div>

                  {/* Field 4: نوع الخدمة */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      نوع الخدمة المطلوبة <span className="text-purple-400">*</span>
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          serviceType: val,
                          logoStyle: val.includes('لوجو') || val.includes('شعار') || val.includes('الهوية') ? formData.logoStyle || 'modern' : '',
                        });
                        setLogoStyleError(false);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-[#181826] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                    >
                      <option value="تصميم اللوجوهات">تصميم شعار / لوجو احترافي (Logo Design)</option>
                      <option value="الهوية البصرية المتكاملة">هوية بصرية متكاملة (Brand Identity)</option>
                      <option value="تصاميم السوشيال ميديا">تصاميم السوشيال ميديا (Social Media Posts)</option>
                      <option value="البوسترات والإعلانات">بوسترات وإعلانات (Posters & Ads)</option>
                      <option value="خدمة مخصصة أُخرى">استفسار أو خدمة أخرى</option>
                    </select>
                  </div>

                  {/* Mandatory Logo Style Selection for Logo & Branding Services */}
                  {isLogoService && (
                    <div className="space-y-3 pt-2 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>ستايل اللوجو المطلوب</span>
                          <span className="text-purple-400 text-xs font-bold">(إجباري *)</span>
                        </label>
                        {formData.logoStyle && (
                          <span className="text-[11px] font-bold text-purple-300 bg-purple-900/60 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                            تم اختيار {LOGO_STYLES.find(s => s.id === formData.logoStyle)?.label}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400">
                        حدد الستايل والمظهر الذي يناسب نشاطك التجاري (يمكن اختيار ستايل واحد فقط):
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {LOGO_STYLES.map((style) => {
                          const isSelected = formData.logoStyle === style.id;
                          return (
                            <button
                              key={style.id}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, logoStyle: style.id });
                                setLogoStyleError(false);
                              }}
                              className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] scale-[1.01]'
                                  : 'bg-[#181828] border-purple-500/20 text-slate-300 hover:border-purple-500/50 hover:bg-[#1f1f33]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                  <span>{style.label}</span>
                                  <span className="text-[10px] font-normal text-purple-300">({style.labelAr})</span>
                                </span>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'border-purple-400 bg-purple-500 text-white'
                                      : 'border-slate-600 bg-slate-900'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                              <span className="text-[11px] text-slate-400 leading-tight">
                                {style.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {logoStyleError && (
                        <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 animate-bounce">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>يرجى اختيار ستايل اللوجو المناسب لمشروعك لإكمال الطلب.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Field 5: تفاصيل الطلب */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      تفاصيل الطلب والفكرة <span className="text-purple-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="اكتب نبذة عن مشروعك، عدد التصاميم، والمجال..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#181826] border border-purple-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="contact-submit-btn"
                    className={`w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] active:scale-98 transition-all cursor-pointer ${
                      isSubmitting ? 'opacity-80 cursor-wait' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>جاري إرسال وتجهيز الطلب...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>إرسال الطلب وإكمال عبر الواتساب</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
