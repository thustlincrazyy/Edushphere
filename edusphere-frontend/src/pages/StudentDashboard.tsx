import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard, BookOpen, GraduationCap, PlayCircle, Bot,
  CalendarCheck, TrendingUp, CreditCard, Sprout, Bell, ArrowRight,
  Activity, Flower2, BookText, Newspaper, Gamepad2
} from "lucide-react";
import DashboardSidebar, { NavItem } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, ResponsiveContainer, RadialBarChart, RadialBar, XAxis, Tooltip } from "recharts";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, emotionAPI, getToken, getUser, saveUser } from "@/lib/api";
import { toast } from "sonner";
import { MathSprint } from "@/components/MathSprint";
import { MemoryMatch } from "@/components/MemoryMatch";
import { SimonSays } from "@/components/SimonSays";
import { WordScramble } from "@/components/WordScramble";
import { SpeedQuiz } from "@/components/SpeedQuiz";
import { LogicalPuzzle } from "@/components/LogicalPuzzle";
import { X } from "lucide-react";

type Profile = { 
  name?: string; 
  email?: string; 
  role?: string;
  student_stats?: {
    attendance: number;
    avg_score: number;
    engagement: number;
  };
  enrolled_courses?: any[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/student-dashboard", icon: LayoutDashboard },
  { label: "Courses", to: "/student-dashboard?tab=courses", icon: BookOpen },
  { label: "Leaderboard", to: "/student-dashboard?tab=leaderboard", icon: TrendingUp },
  { label: "Yoga", to: "/student-dashboard?tab=yoga", icon: Activity },
  { label: "Meditation", to: "/student-dashboard?tab=meditation", icon: Flower2 },
  { label: "Stories", to: "/student-dashboard?tab=stories", icon: BookText },
  { label: "News", to: "/student-dashboard?tab=news", icon: Newspaper },
  { label: "Games", to: "/student-dashboard?tab=games", icon: Gamepad2 },
];

// Live data arrays initialized empty
const attendanceData: any[] = [];
const scoreData: any[] = [];


// Removed hardcoded courses constant

const yogaPoses = [
  { name: "Padmasana (Lotus Pose)", icon: "🧘‍♀️", desc: "Improves concentration and calms the brain. Perfect for starting your study session." },
  { name: "Vrikshasana (Tree Pose)", icon: "🌳", desc: "Improves balance and focus. Helps in achieving a stable state of mind." },
  { name: "Balasana (Child's Pose)", icon: "🙇‍♂️", desc: "Relieves stress and fatigue. Good for resting between intense study hours." },
  { name: "Bhujangasana (Cobra Pose)", icon: "🐍", desc: "Relieves back pain from sitting and studying for long hours." },
  { name: "Sukhasana (Easy Pose)", icon: "✨", desc: "Reduces anxiety, stress, and mental fatigue." },
  { name: "Surya Namaskar", icon: "🌞", desc: "A full-body workout that boosts energy and keeps you active all day." }
];

const indianStories = [
  { title: "Arjuna's Perfect Focus", source: "Mahabharata", icon: "🏹", lesson: "Concentration is everything. Focus only on the 'eye of the bird' (your goal) and ignore distractions." },
  { title: "Ekalavya's Dedication", source: "Mahabharata", icon: "🗿", lesson: "True learning comes from within. Absolute dedication and self-study can make you a master." },
  { title: "Hanuman's Leap of Faith", source: "Ramayana", icon: "🐒", lesson: "You don't know your own potential until someone reminds you. Believe in your limitless power." },
  { title: "Rama's Obedience", source: "Ramayana", icon: "👑", lesson: "Discipline, patience, and respecting your duties shape your character for long-term success." },
  { title: "Krishna's Strategy", source: "Mahabharata", icon: "🦚", lesson: "Work smart. Sometimes intellect and right strategy are more important than pure hard work." },
  { title: "Karna's Generosity", source: "Mahabharata", icon: "☀️", lesson: "True character is defined by how you treat others, even when you have nothing." }
];

const dailyNews = [
  { category: "Technology", title: "ISRO announces new Gaganyaan mission timeline", icon: "🚀" },
  { category: "Educational", title: "CBSE introduces AI and Coding from Class 6", icon: "📚" },
  { category: "Sports", title: "India wins historic Gold at Asian Athletics", icon: "🏅" },
  { category: "Constitutional", title: "Supreme Court's new ruling on Right to Education", icon: "⚖️" }
];

const interactiveGames = [
  { name: "Simon Says", icon: "🎯", color: "bg-blue-100 text-blue-600", desc: "Memory sequence game", type: "internal" },
  { name: "Memory Cards", icon: "🃏", color: "bg-purple-100 text-purple-600", desc: "Match the pairs", type: "internal" },
  { name: "Math Sprint", icon: "➕", color: "bg-green-100 text-green-600", desc: "10 questions in 60s", type: "internal" },
  { name: "Word Scramble", icon: "🔤", color: "bg-orange-100 text-orange-600", desc: "Unscramble the word", type: "internal" },
  { name: "Logical Puzzle", icon: "🧩", color: "bg-pink-100 text-pink-600", desc: "Solve the grid", type: "internal" },
  { name: "Speed Quiz", icon: "⏱️", color: "bg-teal-100 text-teal-600", desc: "Test your GK", type: "internal" }
];

function MiniArea({ data, color }: { data: any[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} fill={`url(#grad-${color})`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CameraConsent({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🎓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enable Smart Learning</h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-indigo-800 font-semibold mb-2">📸 Camera Access Request</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            EduSphere uses your camera to detect your <strong>learning state</strong> (focused, confused, tired etc.)
            and provide <strong>personalised support</strong> while you study.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><span className="text-green-500">✅</span> Only used during active learning sessions</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✅</span> No images or videos are stored anywhere</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✅</span> No data is shared with third parties</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✅</span> You can disable this anytime</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✅</span> Fully compliant with privacy standards</li>
          </ul>
        </div>
        <p className="text-gray-400 text-xs mb-6 italic">
          "We respect your privacy. This feature exists solely to help you learn better."
        </p>
        <div className="flex gap-3">
          <button onClick={onDecline}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition">
            Not Now
          </button>
          <button onClick={onAccept}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
            Enable Camera 📸
          </button>
        </div>
      </div>
    </div>
  );
}

// Emoji map uses RAW emotion labels returned by the backend
const RAW_EMOJI: Record<string, string> = {
  happy:   "😊",
  sad:     "😢",
  angry:   "😠",
  surprise:"😲",
  fear:    "😨",
  disgust: "🤢",
  neutral: "😐",
};

// Color + label for the mapped LEARNING STATE
const STATE_STYLE: Record<string, { color: string; label: string }> = {
  focused:    { color: "bg-green-100 text-green-700",  label: "Focused 🎯" },
  neutral:    { color: "bg-gray-100 text-gray-600",    label: "Neutral 😐" },
  confused:   { color: "bg-yellow-100 text-yellow-700",label: "Confused 🤔" },
  frustrated: { color: "bg-red-100 text-red-700",      label: "Frustrated 😤" },
  hopeless:   { color: "bg-blue-100 text-blue-700",    label: "Needs Help 💙" },
};

function EmotionCamera({ enabled }: { enabled: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [rawEmotion, setRawEmotion]   = useState("neutral");  // e.g. "happy"
  const [stateEmotion, setStateEmotion] = useState("neutral"); // e.g. "focused"
  const [confidence, setConfidence]   = useState(0);
  const [isRunning, setIsRunning]     = useState(false);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsRunning(true);
      setInterval(() => {
        const canvas = document.createElement("canvas");
        const video = videoRef.current;
        if (!video) return;
        canvas.width = 320; canvas.height = 240;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg", 0.7);
        emotionAPI.analyze(base64)
          .then((r: any) => {
            // dominant_emotion = mapped learning state (focused / confused / frustrated / hopeless)
            // raw_emotion      = actual FER label    (happy / sad / angry / …)
            setStateEmotion(r.dominant_emotion || "neutral");
            setRawEmotion(r.raw_emotion        || "neutral");
            setConfidence(r.confidence         || 0);
          })
          .catch(() => {});
      }, 3000); // poll every 3s for snappier response
    } catch {
      toast.error("Camera access denied");
    }
  };

  useEffect(() => {
    if (enabled && !isRunning) start();
  }, [enabled]);

  const emoji  = RAW_EMOJI[rawEmotion]   ?? "😐";
  const style  = STATE_STYLE[stateEmotion] ?? STATE_STYLE["neutral"];

  return (
    <Card className="p-5 border-2 border-primary/10 shadow-soft mt-6">
      <h3 className="font-bold text-lg mb-3">😊 Emotion Detection</h3>
      <video ref={videoRef} autoPlay muted className="rounded-xl w-full max-w-xs" />

      <div className="mt-4 flex items-center gap-4">
        {/* Big emoji from raw emotion */}
        <span className="text-4xl">{emoji}</span>

        <div>
          {/* Learning state badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${style.color}`}>
            {style.label}
          </span>
          {/* Raw emotion + confidence */}
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            {rawEmotion} &bull; {confidence.toFixed(1)}% confidence
          </p>
        </div>
      </div>

      {!isRunning && (
        <Button onClick={start} className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">
          Start Camera
        </Button>
      )}
    </Card>
  );
}

export default function StudentDashboard() {
  const [showCourses, setShowCourses] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "dashboard";
  const [user, setUser] = useState<Profile | null>(getUser());
  const [cameraConsent, setCameraConsent] = useState<"pending" | "accepted" | "declined">(() => {
    return localStorage.getItem("edusphere_camera_consent") === "true" ? "accepted" : "pending";
  });

  const [dashboardStats, setDashboardStats] = useState({
    attendance: 0,
    avgScore: 0,
    engagement: 0,
    courses: 0
  });

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeGame, setActiveGame] = useState<any | null>(null);
  const [activeMusic, setActiveMusic] = useState<string | null>(null);

  useEffect(() => {
    // Fetch profile and stats
    const fetchProfile = () => {
      authAPI.getProfile().then(profile => {
        setUser(profile);
        saveUser(profile);
        if (profile.student_stats) {
          setDashboardStats({
            attendance: profile.student_stats.attendance,
            avgScore: profile.student_stats.avg_score,
            engagement: profile.student_stats.engagement,
            courses: profile.enrolled_courses ? profile.enrolled_courses.length : 0
          });
        }
      }).catch(err => {
        console.error("Profile fetch error", err);
      });
    };

    fetchProfile();

    // Heartbeat for Engagement (every 60s)
    const hbInterval = setInterval(() => {
      authAPI.heartbeat().then(() => fetchProfile()).catch(() => {});
    }, 60000);

    authAPI.getLeaderboard().then(res => {
      if (res.leaderboard) setLeaderboard(res.leaderboard);
    }).catch(console.error);
    
    setEnrolledCourses([
      { name: "Mathematics", color: "from-violet-500 to-purple-600", chip: "bg-primary-soft text-primary", progress: 0, lessons: "0/24", compulsory: true },
      { name: "English", color: "from-emerald-500 to-green-500", chip: "bg-accent-soft text-accent", progress: 0, lessons: "0/20", compulsory: true },
      { name: "Chemistry", color: "from-amber-500 to-yellow-500", chip: "bg-secondary-soft text-secondary", progress: 0, lessons: "0/25", compulsory: true },
      { name: "Physics", color: "from-blue-500 to-cyan-500", chip: "bg-blue-100 text-blue-600", progress: 0, lessons: "0/30", compulsory: true },
      { name: "Programming", color: "from-pink-500 to-rose-500", chip: "bg-pink-100 text-pink-600", progress: 0, lessons: "0/28", compulsory: true },
      { name: "Art & Design", color: "from-orange-500 to-red-500", chip: "bg-orange-100 text-orange-600", progress: 0, lessons: "0/15", compulsory: false },
      { name: "Music Theory", color: "from-indigo-500 to-blue-500", chip: "bg-indigo-100 text-indigo-600", progress: 0, lessons: "0/12", compulsory: false },
      { name: "History of India", color: "from-yellow-600 to-orange-700", chip: "bg-yellow-100 text-yellow-700", progress: 0, lessons: "0/40", compulsory: false },
      { name: "Environmental Sci", color: "from-green-600 to-emerald-700", chip: "bg-green-100 text-green-700", progress: 0, lessons: "0/20", compulsory: false },
      { name: "Physical Education", color: "from-red-600 to-pink-700", chip: "bg-red-100 text-red-700", progress: 0, lessons: "0/10", compulsory: false },
    ]);

    return () => clearInterval(hbInterval);
  }, [navigate]);
  
  const handleGameComplete = async (gameScore: number) => {
    try {
      const response = await authAPI.updateStats({ game_score: gameScore });
      
      // Refresh profile to get recalculated live average
      const profile = await authAPI.getProfile();
      setUser(profile);
      saveUser(profile);
      setDashboardStats({
        attendance: profile.student_stats.attendance,
        avgScore: profile.student_stats.avg_score,
        engagement: profile.student_stats.engagement,
        courses: dashboardStats.courses
      });
      
      toast.success(`Score synced: ${gameScore}! New Avg: ${profile.student_stats.avg_score}%`);
    } catch (err) {
      console.error("Failed to update stats", err);
    }
  };

  const displayName = user?.name || "Student";
  const initials = displayName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-background mandala-bg">

      {cameraConsent === "pending" && (
        <CameraConsent
          onAccept={() => {
            setCameraConsent("accepted");
            localStorage.setItem("edusphere_camera_consent", "true");
          }}
          onDecline={() => setCameraConsent("declined")}
        />
      )}

      <DashboardSidebar items={navItems} />
      <div className="lg:pl-[220px] pt-14 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">

          {currentTab === "dashboard" && (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-glow">{initials}</div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName.split(" ")[0]}!</h1>
                    <p className="text-muted-foreground text-sm">Here's your learning snapshot for today</p>
                  </div>
                </div>
                <Button variant="outline" size="icon" className="rounded-full border-primary/20 hidden md:flex">
                  <Bell className="w-4 h-4 text-primary" />
                </Button>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <Card className="p-4 md:p-5 border-2 border-primary/10 shadow-soft hover:shadow-card transition-smooth">
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Attendance (Monthly)</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{dashboardStats.attendance}%</p>
                  <div className="h-1 bg-green-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${dashboardStats.attendance}%` }} />
                  </div>
                </Card>
                <Card className="p-4 md:p-5 border-2 border-primary/10 shadow-soft hover:shadow-card transition-smooth">
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Avg Quiz Score</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{dashboardStats.avgScore}<span className="text-sm text-muted-foreground">/100</span></p>
                  <div className="h-1 bg-violet-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-violet-500" style={{ width: `${dashboardStats.avgScore}%` }} />
                  </div>
                </Card>
                <Card className="p-4 md:p-5 border-2 border-primary/10 shadow-soft hover:shadow-card transition-smooth">
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Weekly Engagement</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{dashboardStats.engagement}%</p>
                  <ResponsiveContainer width="100%" height={50}>
                    <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "engagement", value: dashboardStats.engagement, fill: "#F59E0B" }]} startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#F59E0B" background={{ fill: "#F5F3FF" } as any} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>


              <Card className="p-8 mt-8 mb-8 gradient-primary border-0 shadow-glow text-white relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
                <div className="absolute -right-8 -bottom-12 w-32 h-32 rounded-full bg-white/10" />
                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to learn today?</h2>
                  <p className="text-white/90 mb-6">Pick up where you left off — your AI tutor is waiting!</p>
                  <Button onClick={() => setShowCourses(true)} className="bg-white text-primary hover:bg-white/90 shadow-card">
                    Let's Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>

              {showCourses && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-xl font-bold mb-4">Your Courses</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {enrolledCourses.map((c, i) => (
                      <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }}>
                        <Card className="p-5 border-2 border-primary/10 hover:border-primary/30 transition-smooth shadow-soft hover:shadow-card">
                          <div className={`h-28 rounded-xl bg-gradient-to-br ${c.color} mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-soft`}>
                            {c.name[0]}
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{c.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.chip}`}>{c.lessons}</span>
                          </div>
                          <Progress value={c.progress} className="h-2 mb-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{c.progress}% complete</span>
                            <Button onClick={() => navigate(`/course/${c.name.toLowerCase()}/video/1`)} size="sm" variant="ghost" className="text-primary hover:bg-primary-soft">
                              Continue <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}

          {currentTab === "courses" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">📚 All Courses</h2>
                <p className="text-muted-foreground">Showing your 5 compulsory subjects and other available courses.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((c, i) => (
                  <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }}>
                    <Card className={`p-6 border-2 transition-all shadow-soft hover:shadow-card relative overflow-hidden ${c.compulsory ? 'border-primary/30' : 'border-gray-100'}`}>
                      {c.compulsory && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest rounded-bl-xl shadow-sm z-10">
                          Compulsory
                        </div>
                      )}
                      <div className={`h-32 rounded-2xl bg-gradient-to-br ${c.color} mb-5 flex items-center justify-center text-white font-extrabold text-3xl shadow-soft`}>
                        {c.name[0]}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg">{c.name}</h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${c.chip}`}>{c.lessons}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                          <span>Progress</span>
                          <span>{c.progress}%</span>
                        </div>
                        <Progress value={c.progress} className="h-2" />
                      </div>
                      <Button onClick={() => navigate(`/course/${c.name.toLowerCase().replace(/\s+/g, '-')}/video/1`)} className={`w-full ${c.compulsory ? 'bg-primary hover:bg-primary/90' : 'bg-gray-800 hover:bg-gray-900'}`}>
                        {c.progress > 0 ? "Continue Learning" : "Start Learning"} <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentTab === "leaderboard" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">🏆 Global Leaderboard</h2>
                <p className="text-muted-foreground">Top 10 most engaged students across the platform.</p>
              </div>
              <Card className="border-2 border-primary/10 shadow-soft max-w-4xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-primary/5 text-primary text-xs uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4 text-center">Engagement Score</th>
                      <th className="px-6 py-4 text-center">Avg Subject Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaderboard.length > 0 ? leaderboard.map((student, i) => (
                      <tr key={i} className={`hover:bg-gray-50 transition-colors ${i < 3 ? 'bg-orange-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900 shadow-glow' : i === 1 ? 'bg-gray-300 text-gray-800' : i === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-100 text-gray-500'}`}>
                            {i + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-center font-bold text-indigo-600 text-lg">{student.engagement}</td>
                        <td className="px-6 py-4 text-center font-medium text-gray-600">{student.score}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">No data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {currentTab === "yoga" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">🧘‍♀️ Student Yoga</h2>
                <p className="text-muted-foreground">Keep your body and mind healthy between study sessions.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {yogaPoses.map((pose) => (
                  <Card key={pose.name} className="p-6 hover:shadow-lg transition-all border-green-100 bg-green-50/30">
                    <div className="text-6xl mb-4">{pose.icon}</div>
                    <h3 className="font-bold text-lg mb-2 text-green-900">{pose.name}</h3>
                    <p className="text-sm text-green-700 leading-relaxed">{pose.desc}</p>
                    <Button onClick={() => setActiveMusic("5qap5aO4i9A")} variant="outline" className="mt-4 w-full border-green-200 text-green-700 hover:bg-green-100">
                      Learn Pose & Music 🎵
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {currentTab === "meditation" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-full max-w-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                <div className="relative z-10">
                  <div className="text-8xl mb-8 animate-bounce">🪷</div>
                  <h2 className="text-4xl font-bold mb-4">Peaceful Meditation</h2>
                  <p className="text-lg opacity-90 mb-8 max-w-md mx-auto">
                    Take a moment to clear your mind. Listen to peaceful music and find your center before you start studying again.
                  </p>
                  <Button onClick={() => setActiveMusic("jfKfPfyJRdk")} size="lg" className="bg-white text-purple-600 hover:bg-white/90 text-lg rounded-full px-8 py-6 shadow-glow">
                    ▶ Play Peaceful Music
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === "stories" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">📜 Ancient Roots</h2>
                <p className="text-muted-foreground">Moral lessons and inspiration from the Ramayana and Mahabharata.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {indianStories.map((story) => (
                  <Card key={story.title} className="p-6 border-orange-100 bg-orange-50/50 hover:shadow-card transition-smooth">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl shadow-sm shrink-0">
                        {story.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-orange-950 mb-1">{story.title}</h3>
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-orange-200 text-orange-800 mb-3 uppercase tracking-wider">{story.source}</span>
                        <p className="text-sm text-orange-900 leading-relaxed font-medium bg-white/60 p-3 rounded-lg">
                          💡 <strong>Lesson:</strong> {story.lesson}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {currentTab === "news" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">📰 Daily Update</h2>
                <p className="text-muted-foreground">Stay informed with educational, tech, sports, and constitutional news.</p>
              </div>
              <div className="flex flex-col gap-4">
                {dailyNews.map((news) => (
                  <Card key={news.title} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-l-primary">
                    <div className="text-3xl bg-gray-100 w-12 h-12 flex items-center justify-center rounded-xl shrink-0">
                      {news.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{news.category}</p>
                      <h4 className="font-semibold text-lg text-gray-900">{news.title}</h4>
                    </div>
                    <Button variant="ghost" size="icon"><ArrowRight className="w-5 h-5 text-gray-400" /></Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeMusic && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-8 right-8 z-[110] bg-white rounded-2xl shadow-2xl p-4 border-2 border-primary/20 w-80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center animate-spin-slow text-primary">🎵</div>
                  <span className="font-bold text-sm">Playing Relaxing Music</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setActiveMusic(null)} className="h-8 w-8 rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe 
                  src={`https://www.youtube.com/embed/${activeMusic}?autoplay=1&controls=0&modestbranding=1`} 
                  className="w-full h-full border-0"
                  allow="autoplay"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center italic">"Music helps the mind focus and the soul find peace."</p>
            </motion.div>
          )}

          {activeGame && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
              <div className="p-3 md:p-4 flex items-center justify-between text-white bg-gray-900/50 backdrop-blur-md">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${activeGame.color} flex items-center justify-center text-xl md:text-2xl`}>{activeGame.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold">{activeGame.name}</h3>
                </div>
                <Button variant="ghost" onClick={() => setActiveGame(null)} className="text-white hover:bg-white/10 rounded-full h-10 w-10 md:h-12 md:w-12 p-0">
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </div>
              <div className="flex-1 w-full bg-white relative overflow-y-auto">
                {activeGame.name === "Math Sprint" && <MathSprint onComplete={(s) => { toast.success(`Great job! Scored ${s}`); handleGameComplete(s); }} />}
                {activeGame.name === "Memory Cards" && <MemoryMatch onComplete={(s) => { toast.success(`Memory Master! Scored ${s}`); handleGameComplete(s); }} />}
                {activeGame.name === "Simon Says" && <SimonSays onComplete={(s) => { toast.success(`Simon is impressed! Scored ${s}`); handleGameComplete(s); }} />}
                {activeGame.name === "Word Scramble" && <WordScramble onComplete={(s) => { toast.success(`Word Smith! Scored ${s}`); handleGameComplete(s); }} />}
                {activeGame.name === "Speed Quiz" && <SpeedQuiz onComplete={(s) => { toast.success(`Quiz Whiz! Scored ${s}`); handleGameComplete(s); }} />}
                {activeGame.name === "Logical Puzzle" && <LogicalPuzzle onComplete={(s) => { toast.success(`Logic King! Scored ${s}`); handleGameComplete(s); }} />}
              </div>
            </motion.div>
          )}

          {currentTab === "games" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">🎮 Brain Games</h2>
                <p className="text-muted-foreground">Wake up your mind with these interactive mini-games!</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {interactiveGames.map((game) => (
                  <Card key={game.name} className="p-6 hover:shadow-card transition-smooth cursor-pointer text-center group">
                    <div className={`w-20 h-20 mx-auto rounded-2xl ${game.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                      {game.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-1">{game.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{game.desc}</p>
                    <Button onClick={() => setActiveGame(game)} className="w-full rounded-full">Play Now</Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
