import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Community from "./pages/Community";
import Emergency from "./pages/Emergency";
import Tests from "./pages/Tests";
import Learn from "./pages/Learn";
import Appointments from "./pages/Appointments";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import { ChatRoom } from "./components/chat/ChatRoom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DeveloperSettings } from "./components/dev/DeveloperSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DeveloperSettings />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignupPage />} />
            <Route path="/auth" element={<SigninPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ai-chat" element={<AIChat />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community/room/:roomId" element={<ChatRoom />} />
                    <Route path="/emergency" element={<Emergency />} />
                    <Route path="/tests" element={<Tests />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
