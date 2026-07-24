import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { checkIsAdmin } from './lib/userService';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import QuickOrderModal from './components/QuickOrderModal';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import LoadingIntro from './components/LoadingIntro';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [route, setRoute] = useState<'public' | 'admin'>('public');

  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('');
  
  // Quiet Mode (Motion toggle state)
  const [isQuietMode, setIsQuietMode] = useState<boolean>(() => {
    return localStorage.getItem('darkdesigner_quiet_mode') === 'true';
  });

  useEffect(() => {
    if (isQuietMode) {
      document.documentElement.classList.add('quiet-mode');
      localStorage.setItem('darkdesigner_quiet_mode', 'true');
    } else {
      document.documentElement.classList.remove('quiet-mode');
      localStorage.setItem('darkdesigner_quiet_mode', 'false');
    }
  }, [isQuietMode]);

  const toggleQuietMode = () => {
    setIsQuietMode((prev) => !prev);
  };

  // Sync route with window location
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin') {
        setRoute('admin');
      } else {
        setRoute('public');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Sync Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const isAdmin = await checkIsAdmin(currentUser.uid, currentUser.email);
        if (!isAdmin) {
          console.warn('Unauthorized login attempt detected:', currentUser.email);
          await auth.signOut();
          setUser(null);
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    if (path === '/admin') {
      setRoute('admin');
    } else {
      setRoute('public');
    }
  };

  const handleSelectServiceFromServices = (serviceTitle: string) => {
    setSelectedServiceForContact(serviceTitle);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render Admin view if route is admin
  if (route === 'admin') {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 font-mono">جاري التحقق من أذونات الدخول...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return <AdminLogin onBackToSite={() => navigateTo('/')} />;
    }

    return <AdminDashboard user={user} onViewSite={() => navigateTo('/')} />;
  }

  // Render Public Site
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-['IBM_Plex_Sans_Arabic','Cairo',sans-serif] selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* Intro Animation (runs once per session) */}
      <LoadingIntro />

      {/* Custom Neon Cursor */}
      <CustomCursor isQuietMode={isQuietMode} />

      {/* Top Navbar */}
      <Navbar
        onOpenQuickOrder={() => setQuickOrderOpen(true)}
        isQuietMode={isQuietMode}
        onToggleQuietMode={toggleQuietMode}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero onOpenQuickOrder={() => setQuickOrderOpen(true)} />

        {/* 2. About Section */}
        <About onOpenQuickOrder={() => setQuickOrderOpen(true)} />

        {/* 3. Services Section */}
        <Services onSelectService={handleSelectServiceFromServices} />

        {/* 4. Portfolio Gallery Section */}
        <Portfolio />

        {/* 5. Why Choose Us Section */}
        <WhyChooseUs />

        {/* 6. Testimonials Section */}
        <Testimonials />

        {/* 7. FAQ Accordion Section */}
        <FAQ />

        {/* 8. Contact Section */}
        <Contact preselectedService={selectedServiceForContact} />
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Always Visible Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Interactive Quick Order / Cost Estimator Modal */}
      <QuickOrderModal
        isOpen={quickOrderOpen}
        onClose={() => setQuickOrderOpen(false)}
        defaultService={selectedServiceForContact}
      />
    </div>
  );
}
