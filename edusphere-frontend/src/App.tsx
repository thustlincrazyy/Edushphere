import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import Courses from "./pages/Courses";
import VideoPlayer from "./pages/VideoPlayer";
import NotFound from "./pages/NotFound.tsx";
import FloatingChatbot from "./components/FloatingChatbot";
import ChatBot from "./pages/ChatBot";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/course/:courseName/video/:videoId" element={<VideoPlayer />} />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
        <FloatingChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
