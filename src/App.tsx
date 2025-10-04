import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ProtectedRoute from "./features/admin/components/ProtectedRoute";
import AdminLayout from "./features/admin/components/AdminLayout";
import ProductManagement from "./features/admin/pages/ProductManagement";

import HomePage from "./features/admin/pages/HomePage";
import CatalogPage from "./features/admin/pages/CatalogPage";
import OrdersPage from "./features/admin/pages/OrdersPage";
import AboutPage from "./features/admin/pages/AboutPage";
import FAQPage from "./features/admin/pages/FAQPage";
import ContactPage from "./features/admin/pages/ContactPage";
import FooterPage from "./features/admin/pages/FooterPage";
import { ThemeProvider } from "@/features/shared/contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Admin />} />
                <Route path="home" element={<HomePage />} />
                <Route path="catalog-page" element={<CatalogPage />} />
                <Route path="orders-page" element={<OrdersPage />} />
                <Route path="about-page" element={<AboutPage />} />
                <Route path="faq-page" element={<FAQPage />} />
                <Route path="contact-page" element={<ContactPage />} />
                <Route path="footer" element={<FooterPage />} />
                <Route path="products" element={<ProductManagement />} />
              </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;