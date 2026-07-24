import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createOrUpdateAdminUser, ADMIN_EMAIL, checkIsAdmin } from '../lib/userService';
import { checkRateLimit } from '../lib/security';
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowLeft,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  UserCheck,
  UserPlus,
} from 'lucide-react';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export default function AdminLogin({ onBackToSite }: AdminLoginProps) {
  const [viewMode, setViewMode] = useState<'login' | 'setup' | 'forgot'>('login');

  // Common email state (default to authorized admin email)
  const [email, setEmail] = useState(ADMIN_EMAIL);

  // Normal Login state
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // First-Time Setup state
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupSuccess, setSetupSuccess] = useState<string | null>(null);

  // Forgot Password state
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // --- HANDLE NORMAL LOGIN ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Rate limiting brute-force check
    const rateCheck = checkRateLimit('admin_login_attempt', 5, 60000); // Max 5 attempts per minute
    if (!rateCheck.allowed) {
      const secondsLeft = Math.ceil(rateCheck.remainingMs / 1000);
      setLoginError(`تم تتجاوز عدد المحاولات المسموح بها لحماية الحساب. يرجى الانتظار ${secondsLeft} ثانية.`);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !loginPassword) {
      setLoginError('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    // Strict client check
    if (trimmedEmail !== ADMIN_EMAIL) {
      setLoginError('هذا الحساب غير مخوّل للوصول إلى لوحة التحكم.');
      return;
    }

    setLoginLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, loginPassword);
      const user = userCredential.user;

      // Verify Firestore admin role
      const isAdmin = await checkIsAdmin(user.uid, user.email);

      if (!isAdmin) {
        await signOut(auth);
        setLoginError('هذا الحساب غير مخوّل للوصول إلى لوحة التحكم.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password'
      ) {
        setLoginError('البريد أو كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/user-not-found') {
        setLoginError(
          'الحساب غير موجود في Firebase. إذا كانت هذه المرة الأولى، يرجى الضغط على تبويب (إنشاء كلمة المرور لأول مرة) في الأعلى.'
        );
      } else if (err.code === 'auth/too-many-requests') {
        setLoginError('تم حظر المحاولات مؤقتًا لكثرة الأخطاء. يرجى المحاولة لاحقًا.');
      } else {
        setLoginError('حدث خطأ أثناء تسجيل الدخول: ' + (err.message || 'خطأ غير معروف'));
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // --- HANDLE FIRST-TIME SETUP ---
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);
    setSetupSuccess(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail !== ADMIN_EMAIL) {
      setSetupError('هذا الحساب غير مخوّل للوصول إلى لوحة التحكم.');
      return;
    }

    if (!setupPassword || !setupConfirmPassword) {
      setSetupError('يرجى ملء جميع الحقول المطلوب إدخالها.');
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setSetupError('كلمة المرور وتأكيدها غير متطابقين.');
      return;
    }

    if (setupPassword.length < 6) {
      setSetupError('كلمة المرور يجب أن تكون 6 أحرف أو أكثر.');
      return;
    }

    setSetupLoading(true);

    try {
      // 1. Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, setupPassword);
      const user = userCredential.user;

      // 2. Write admin role doc in Firestore
      await createOrUpdateAdminUser(user.uid, trimmedEmail);

      setSetupSuccess('تم إنشاء كلمة المرور بنجاح. جاري توجيهك إلى لوحة التحكم...');
    } catch (err: any) {
      console.error('Setup account error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setSetupError(
          'تم إنشاء حساب المسؤول سابقًا بالفعل! يمكنك تسجيل الدخول مباشرة أو إرسال رابط لإعادة تعيين كلمة المرور.'
        );
      } else if (err.code === 'auth/weak-password') {
        setSetupError('كلمة المرور يجب أن تكون 6 أحرف أو أكثر.');
      } else {
        setSetupError('حدث خطأ أثناء إنشاء كلمة المرور: ' + (err.message || 'خطأ غير معروف'));
      }
    } finally {
      setSetupLoading(false);
    }
  };

  // --- HANDLE FORGOT PASSWORD RESET ---
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);

    const trimmedResetEmail = email.trim().toLowerCase();

    if (!trimmedResetEmail) {
      setResetError('يرجى كتابة البريد الإلكتروني');
      return;
    }

    if (trimmedResetEmail !== ADMIN_EMAIL) {
      setResetError('هذا الحساب غير مخوّل للوصول إلى لوحة التحكم.');
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, trimmedResetEmail);
      setResetSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setResetError('لم يتم إنشاء حساب المسؤول بعد. يرجى اختيار (إنشاء كلمة المرور لأول مرة).');
      } else {
        setResetError('فشل إرسال رابط إعادة التعيين: ' + (err.message || 'خطأ غير معروف'));
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden dir-rtl font-['IBM_Plex_Sans_Arabic','Cairo',sans-serif]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-900 via-purple-600 to-indigo-500 p-0.5 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[14px] flex items-center justify-center text-white">
              {viewMode === 'login' && <Lock className="w-8 h-8 text-purple-400" />}
              {viewMode === 'setup' && <UserPlus className="w-8 h-8 text-purple-400" />}
              {viewMode === 'forgot' && <KeyRound className="w-8 h-8 text-purple-400" />}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <span>
                {viewMode === 'login' && 'تسجيل دخول المسؤول'}
                {viewMode === 'setup' && 'إعداد كلمة المرور لأول مرة'}
                {viewMode === 'forgot' && 'استعادة كلمة المرور'}
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              لوحة تحكم إدارة معرض أعمال <span className="text-purple-400 font-bold">DARK designer</span>
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#101018] border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Navigation Mode Tabs */}
          {viewMode !== 'forgot' && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#08080d] rounded-2xl border border-purple-500/15 mb-6">
              <button
                type="button"
                onClick={() => {
                  setViewMode('login');
                  setLoginError(null);
                  setSetupError(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === 'login'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-purple-200 hover:bg-purple-950/30'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('setup');
                  setLoginError(null);
                  setSetupError(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === 'setup'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-purple-200 hover:bg-purple-950/30'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إنشاء كلمة المرور لأول مرة</span>
              </button>
            </div>
          )}

          {/* VIEW MODE 1: NORMAL LOGIN */}
          {viewMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              {loginError && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{loginError}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  البريد الإلكتروني للآدمين
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mohsenjake99@gmail.com"
                    required
                    dir="ltr"
                    className="w-full py-3 px-4 pr-10 rounded-xl bg-[#09090e] border border-purple-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs sm:text-sm transition-all"
                  />
                  <Mail className="w-4 h-4 text-purple-400 absolute top-3.5 right-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-300">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('forgot');
                      setResetError(null);
                      setResetSuccess(null);
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-semibold cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    dir="ltr"
                    className="w-full py-3 px-10 pr-10 rounded-xl bg-[#09090e] border border-purple-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs sm:text-sm transition-all"
                  />
                  <Lock className="w-4 h-4 text-purple-400 absolute top-3.5 right-3" />
                  
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute top-3.5 left-3 text-slate-500 hover:text-purple-300 transition-colors cursor-pointer"
                    title={showLoginPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <span>تسجيل الدخول</span>
                )}
              </button>
            </form>
          )}

          {/* VIEW MODE 2: FIRST-TIME SETUP */}
          {viewMode === 'setup' && (
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-purple-200 text-xs leading-relaxed">
                هذا الوضع مخصص لتفعيل حساب المسؤول (<span className="font-mono text-purple-300">{ADMIN_EMAIL}</span>) وتعيين كلمة المرور الخاصة به لأول مرة.
              </div>

              {setupError && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-3 animate-in fade-in">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{setupError}</div>
                </div>
              )}

              {setupSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{setupSuccess}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  البريد الإلكتروني الإداري (ثابت)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                    dir="ltr"
                    className="w-full py-2.5 px-4 pr-10 rounded-xl bg-[#08080d] border border-purple-500/30 text-purple-300 text-xs font-mono cursor-not-allowed opacity-90"
                  />
                  <Mail className="w-4 h-4 text-purple-400 absolute top-3 right-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showSetupPassword ? 'text' : 'password'}
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    placeholder="6 أحرف أو أكثر..."
                    required
                    dir="ltr"
                    className="w-full py-2.5 px-10 pr-10 rounded-xl bg-[#09090e] border border-purple-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition-all"
                  />
                  <Lock className="w-4 h-4 text-purple-400 absolute top-3 right-3" />
                  
                  <button
                    type="button"
                    onClick={() => setShowSetupPassword(!showSetupPassword)}
                    className="absolute top-3 left-3 text-slate-500 hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    {showSetupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showSetupPassword ? 'text' : 'password'}
                    value={setupConfirmPassword}
                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور..."
                    required
                    dir="ltr"
                    className="w-full py-2.5 px-10 pr-10 rounded-xl bg-[#09090e] border border-purple-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs transition-all"
                  />
                  <Lock className="w-4 h-4 text-purple-400 absolute top-3 right-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={setupLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {setupLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري إنشائها وتفعيل الحساب...</span>
                  </>
                ) : (
                  <span>إنشاء كلمة المرور وتفعيل لوحة التحكم</span>
                )}
              </button>
            </form>
          )}

          {/* VIEW MODE 3: FORGOT PASSWORD */}
          {viewMode === 'forgot' && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              
              <p className="text-xs text-slate-300 leading-relaxed">
                أدخل البريد الإلكتروني الخاص بالمسؤول لإرسال رابط إعادة تعيين كلمة المرور آليًا.
              </p>

              {resetError && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-3 animate-in fade-in">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{resetError}</div>
                </div>
              )}

              {resetSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{resetSuccess}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  البريد الإلكتروني للآدمين
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mohsenjake99@gmail.com"
                    required
                    dir="ltr"
                    className="w-full py-3 px-4 pr-10 rounded-xl bg-[#09090e] border border-purple-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs sm:text-sm transition-all"
                  />
                  <Mail className="w-4 h-4 text-purple-400 absolute top-3.5 right-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري إرسال الرابط...</span>
                  </>
                ) : (
                  <span>إرسال رابط إعادة التعيين</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="text-xs text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  &rarr; العودة لصفحة تسجيل الدخول
                </button>
              </div>

            </form>
          )}

          {/* Footer link to main site */}
          <div className="mt-6 pt-6 border-t border-purple-500/10 text-center">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة إلى موقع DARK designer الرئيسي</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
