import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import { subscribeToTestimonials } from '../lib/testimonialService';
import { Star, Quote, ChevronRight, ChevronLeft, MessageSquareHeart } from 'lucide-react';
import { motion } from 'motion/react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((fetched) => {
      setTestimonials(fetched);
      setLoading(false);
    }, false);
    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) return null;

  // If no testimonials published yet, show an inviting feedback block
  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-20 bg-[#0c0c14] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl bg-[#12121e] border border-purple-500/20 shadow-2xl space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <MessageSquareHeart className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">رضا العملاء هو أولويتنا القصوى</h3>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              نحن نعمل باجتهاد لتقديم أفضل جودة تصميم لكل عميل. تواصل معنا لتنفيذ مشروعك القادم وتكون جزءاً من قصص نجاحنا!
            </p>
            <a
              href="https://wa.me/201035592514?text=%D8%A3%D9%87%D9%84%D8%A3%20DARK%20designer%D8%8C%20%D8%AD%D8%A7%D8%A8%D8%A8%20%D8%A3%D8%A8%D8%AF%D8%A3%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%AC%D8%AF%D9%8A%D8%AF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-all"
            >
              <span>ابدأ مشروعك الآن</span>
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-[#0c0c14] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <Quote className="w-4 h-4" />
            <span>آراء وتقييمات العملاء</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ماذا يقول <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">شركاء النجاح؟</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Testimonial Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative bg-[#12121e] border border-purple-500/25 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl"
        >
          <Quote className="absolute top-6 left-6 w-16 h-16 text-purple-500/10 pointer-events-none" />

          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 text-yellow-400">
              {Array.from({ length: activeTestimonial.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-medium italic">
              "{activeTestimonial.text}"
            </p>

            {/* Client Profile Info */}
            <div className="pt-4 border-t border-purple-500/15 flex items-center gap-4">
              {activeTestimonial.imageUrl ? (
                <img
                  src={activeTestimonial.imageUrl}
                  alt={activeTestimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/50 shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-700 to-indigo-900 border-2 border-purple-500/50 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {activeTestimonial.name.charAt(0)}
                </div>
              )}

              <div className="text-right">
                <h4 className="text-base font-bold text-white">{activeTestimonial.name}</h4>
                {activeTestimonial.role && (
                  <p className="text-xs text-purple-400 font-medium">{activeTestimonial.role}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls if more than 1 */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-purple-500/10">
              <div className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {testimonials.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-[#1a1a2e] border border-purple-500/20 text-slate-300 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all cursor-pointer"
                  aria-label="الرأي السابق"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-[#1a1a2e] border border-purple-500/20 text-slate-300 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all cursor-pointer"
                  aria-label="الرأي التالي"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </motion.div>

      </div>
    </section>
  );
}
