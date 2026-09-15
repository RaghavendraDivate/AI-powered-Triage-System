import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Doctors from "./pages/Doctors.jsx";
import Chat from "./pages/Chat.jsx";
import BookingNew from "./pages/BookingNew.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Contact from "./pages/Contact.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import NotFound from "./pages/NotFound.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('admin_token');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/book" element={<BookingNew />} />
            <Route path="/confirmation/:id" element={<Confirmation />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <MyAppointments />    
              </ProtectedRoute>
            } />
            <Route path="/contact" element={<Contact />} />
            {/* Legacy route for backwards compatibility */}
            <Route path="/booking" element={<BookingNew />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
