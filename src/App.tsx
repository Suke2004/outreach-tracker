import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import AppLayout from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ContactsPage from "@/pages/ContactsPage";
import FollowUpsPage from "@/pages/FollowUpsPage";
import TemplatesPage from "@/pages/TemplatesPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import PipelinePage from "@/pages/PipelinePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/follow-ups" element={<FollowUpsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/pipeline" element={<PipelinePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </HashRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;