import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'كيف أطلب تصميمًا من DARK designer؟',
    answer:
      'يمكنك الطلب بسهولة عبر الضغط على أزرار "تواصل عبر واتساب" المتاحة في الموقع، أو الضغط على زر "احسب تكلفة تصميمك" لتحديد تفاصيل مشروعك وإرسال طلب مباشر لنا.',
  },
  {
    id: 'faq-2',
    question: 'ما مدة تنفيذ وتسليم التصميم؟',
    answer:
      'تختلف المواعيد بحسب نوع وحجم العمل: تصاميم السوشيال ميديا تسلّم عادة خلال 24 إلى 48 ساعة. الشعارات والهويات التجارية المستقلة تتطلب من 3 إلى 5 أيام عمل لضمان أعلى درجات الإتقان.',
  },
  {
    id: 'faq-3',
    question: 'هل يمكن طلب تعديلات بعد تسليم التصميم؟',
    answer:
      'نعم بالتأكيد! تتضمن كل خدمة جولة أو جولتين من التعديلات المجانية لضمان رضاك التام عن المظهر النهائي والالتزام الكامل برؤيتك.',
  },
  {
    id: 'faq-4',
    question: 'ما هي صيغ الملفات التي يتم تسليمها للعميل؟',
    answer:
      'نسلّم جميع صيغ الملفات الاحترافية المطلوبة: ملفات للطباعة بدقة عالية (PDF CMYK)، ملفات الاستخدام الرقمي (PNG, JPG)، الملفات المفتوحة المصدر المعتمدة (PSD, AI, SVG).',
  },
  {
    id: 'faq-5',
    question: 'كيف يتم الاتفاق وتحديد سعر التصميم؟',
    answer:
      'يتم تحديد السعر بناءً على تفاصيل المشروع، عدد التصاميم، ومتطلبات الهوية. يتم الاتفاق بوضوح وشفافية قبل البدء بدون أي تكاليف خفية.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            إجابات عن <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">استفساراتك الشائعة</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            كل ما تحتاج معرفته عن طريقة العمل، المواعيد، وتسليم المشاريع مع DARK designer.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#12121e] border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                    : 'bg-[#0f0f18] border-purple-500/15 hover:border-purple-500/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 px-6 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-purple-400' : 'text-slate-600'}`} />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-purple-300' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300/90 leading-relaxed border-t border-purple-500/10 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
