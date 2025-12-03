'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LandingHeader } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { TrustedCompanies } from '@/components/landing/TrustedCompanies';
import { FeatureHighlights } from '@/components/landing/FeatureHighlights';
import { DetailedFeaturesSection } from '@/components/landing/DetailedFeaturesSection';
import { IntegrationSection } from '@/components/landing/IntegrationSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { LandingCta } from '@/components/landing/LandingCta';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations('Landing');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="overflow-x-hidden bg-white font-sans text-[#1e293b] antialiased selection:bg-purple-200 selection:text-purple-900">
      <div className="bg-gradient-blur top-[-200px] left-1/2 -translate-x-1/2" />
      <div className="bg-gradient-blur top-[400px] right-[-400px] bg-blue-100/50" />

      <LandingHeader isScrolled={isScrolled} t={t} />

      <main className="pt-32">
        <HeroSection t={t} />
        <ProductShowcase />
        <TrustedCompanies t={t} />
        <FeatureHighlights t={t} />
        <DetailedFeaturesSection t={t} />
        <IntegrationSection />
        <TestimonialsSection />
        <LandingCta t={t} />
      </main>

      <LandingFooter t={t} />
    </div>
  );
}


