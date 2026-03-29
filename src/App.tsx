
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthScreen from "./components/AuthScreen";
import { getToken, fetchMe, clearToken } from "./lib/api";

const queryClient = new QueryClient();

interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  status: string;
}

function AppInner() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    const cached = localStorage.getItem('sc_user');
    if (cached) {
      try { setUser(JSON.parse(cached)); setLoading(false); return; } catch (_e) { clearToken(); }
    }
    fetchMe().then(res => {
      if (res.error || !res.id) { clearToken(); setLoading(false); return; }
      const u = res as User;
      setUser(u);
      localStorage.setItem('sc_user', JSON.stringify(u));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center animate-pulse-glow">
          <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={(u) => { setUser(u); }} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index user={user} onLogout={() => { clearToken(); setUser(null); }} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppInner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;