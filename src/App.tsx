import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PerformanceMonitor, registerServiceWorker } from "@/components/seo/PerformanceOptimizer";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { CookieConsentBanner } from "@/components/common/CookieConsentBanner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProjectDetails from "./pages/ProjectDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import CategoryForm from "./pages/admin/CategoryForm";
import Projects from "./pages/admin/Projects";
import ProjectForm from "./pages/admin/ProjectForm";
import SEOSettings from "./pages/admin/SEOSettings";
import SiteSettings from "./pages/admin/SiteSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Register service worker for caching
registerServiceWorker();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PerformanceMonitor />
          <CookieConsentBanner />
          <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/proyecto/:slug" element={<ProjectDetails />} />
<<<<<<< HEAD
              <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
              <Route path="/terminos-de-servicio" element={<TermsOfService />} />
=======
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="/termos-de-servico" element={<TermsOfService />} />
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/new" element={<CategoryForm />} />
                <Route path="categories/:id/edit" element={<CategoryForm />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/new" element={<ProjectForm />} />
                <Route path="projects/:id/edit" element={<ProjectForm />} />
                <Route path="seo" element={<SEOSettings />} />
                <Route path="settings" element={<SiteSettings />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
