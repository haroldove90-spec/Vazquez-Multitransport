import React, { useState, useEffect } from 'react';
import { SiteConfig } from './types';
import { loadSiteConfig, loadSiteConfigFromSupabase, applyThemeColors } from './lib/supabaseClient';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { WelcomeBanner } from './components/WelcomeBanner';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { GallerySlider } from './components/GallerySlider';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(loadSiteConfig());
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');

  // Check URL hash for direct #admin access
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setCurrentView('admin');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch live config from Supabase on mount
  useEffect(() => {
    async function fetchRemoteConfig() {
      const remoteConfig = await loadSiteConfigFromSupabase(config);
      if (remoteConfig) {
        setConfig(remoteConfig);
        applyThemeColors(remoteConfig.primaryColor, remoteConfig.secondaryColor);
      }
    }
    fetchRemoteConfig();
  }, []);

  // Apply colors dynamically on boot or update
  useEffect(() => {
    applyThemeColors(config.primaryColor, config.secondaryColor);
  }, [config.primaryColor, config.secondaryColor]);

  // Update page title
  useEffect(() => {
    if (config.pageTitle) {
      document.title = config.pageTitle;
    }
  }, [config.pageTitle]);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    applyThemeColors(newConfig.primaryColor, newConfig.secondaryColor);
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    setCurrentView('landing');
    if (window.location.hash === '#admin') {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900 selection:bg-[#0E5197] selection:text-white">
        <AdminPanel
          isOpen={true}
          onClose={handleCloseAdmin}
          config={config}
          onUpdateConfig={handleUpdateConfig}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#0E5197] selection:text-white flex flex-col">
      {/* 1. Top Bar */}
      <TopBar
        phones={config.topPhones}
        whatsappNumber={config.whatsappNumber}
      />

      {/* 2. Header Navigation */}
      <Header
        logoUrl={config.logoUrl}
        logoSubtext={config.logoSubtext}
        whatsappNumber={config.whatsappNumber}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Anchor Content Sections */}
      <main className="flex-1">
        {/* 3. Hero Slider (#inicio) */}
        <HeroSlider
          slides={config.heroSlides}
          whatsappNumber={config.whatsappNumber}
          defaultMessage={config.whatsappMessage}
        />

        {/* 4. Welcome Message Below Slider */}
        <WelcomeBanner
          title={config.welcomeMessageTitle}
          subtitle={config.welcomeMessageSubtitle}
          body={config.welcomeMessageBody}
          coverageAreas={config.coverageAreas}
        />

        {/* 5. About Us & 3 Value Added Points (#nosotros) */}
        <AboutSection
          title={config.aboutTitle}
          subtitle={config.aboutSubtitle}
          description={config.aboutDescription}
          values={config.aboutValues}
          imageUrl={config.aboutImageUrl}
          imageBadge={config.aboutImageBadge}
          imageTitle={config.aboutImageTitle}
          imageSubtitle={config.aboutImageSubtitle}
          feature1Title={config.aboutFeature1Title}
          feature1Desc={config.aboutFeature1Desc}
          feature2Title={config.aboutFeature2Title}
          feature2Desc={config.aboutFeature2Desc}
          welcomeTitle={config.aboutWelcomeTitle}
          welcomeText={config.aboutWelcomeText}
          quoteBoxTitle={config.aboutQuoteBoxTitle}
          quoteBoxSubtitle={config.aboutQuoteBoxSubtitle}
          quoteBoxButtonText={config.aboutQuoteBoxButtonText}
          whatsappNumber={config.whatsappNumber}
        />

        {/* 6. Services Section (#servicios) */}
        <ServicesSection
          title={config.servicesTitle}
          subtitle={config.servicesSubtitle}
          services={config.servicesList}
          whatsappNumber={config.whatsappNumber}
        />

        {/* 7. Horizontal Moving Business Gallery Slider */}
        <GallerySlider
          title={config.galleryTitle}
          subtitle={config.gallerySubtitle}
          images={config.galleryImages}
        />

        {/* 8. Contact Section (#contacto) */}
        <ContactSection
          title={config.contactTitle}
          subtitle={config.contactSubtitle}
          message={config.contactMessage}
          phones={config.topPhones}
          whatsappNumber={config.whatsappNumber}
          facebookPage={config.facebookPage}
          coverageAreas={config.coverageAreas}
        />
      </main>

      {/* 9. Footer */}
      <Footer
        logoUrl={config.logoUrl}
        logoSubtext={config.logoSubtext}
        whatsappNumber={config.whatsappNumber}
        phones={config.topPhones}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating WhatsApp Action Button */}
      {config.whatsappNumber && (
        <a
          href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#1D7946] hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center border-2 border-white group"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white text-[#1D7946]" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
            Cotizar por WhatsApp
          </span>
        </a>
      )}
    </div>
  );
}
