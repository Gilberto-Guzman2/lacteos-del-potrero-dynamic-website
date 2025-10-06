
import React from 'react';
import SkipNavigation from '@/components/SkipNavigation';
import FontLoader from '@/components/FontLoader';
import Navbar from '@/features/navigation/components/Navbar';
import Hero from '@/features/home/components/Hero';
import ProductGrid from '@/features/catalog/components/ProductGrid';
import OrdersSection from '@/features/orders/components/OrdersSection';
import AboutSection from '@/features/about/components/AboutSectionNew';
import FAQSection from '@/features/faq/components/FAQSection';
import ContactSection from '@/features/contact/components/ContactSection';
import Footer from '@/features/shared/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FontLoader />
      <SkipNavigation />
      <Navbar />
      <main id="main-content" className="pt-16" role="main">
        <Hero />
        <ProductGrid />
        <OrdersSection />
        <AboutSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
