import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, BookUser, Users, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

const roles = [
  { id: "student", label: "Student", icon: GraduationCap, color: "from-violet-500 to-purple-600", border: "border-primary/40", text: "text-primary", route: "/student-dashboard" },
  { id: "teacher", label: "Teacher", icon: BookUser, color: "from-amber-500 to-yellow-500", border: "border-secondary/50", text: "text-secondary", route: "/teacher-dashboard" },
  { id: "parent", label: "Parent", icon: Users, color: "from-emerald-500 to-green-500", border: "border-accent/50", text: "text-accent", route: "/parent-dashboard" },
];

export default function Login() {
  const [role, setRole] = useState<typeof roles[number] | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) return toast.error("Please fill all fields");
    try {
      setLoading(true);
      await authAPI.login(email, pwd);
      toast.success(`Welcome back, ${role?.label}!`);
      setTimeout(() => navigate(role!.route), 400);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mandala-bg gradient-hero flex items-center justify-center px-4 py-10">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to <span className="text-gradient-primary">EduSphere</span></h1>
          <p className="text-muted-foreground">{role ? `Login as ${role.label}` : "Choose your role to begin"}</p>
        </div>

        <AnimatePresence mode="wait">
          {!role ? (
            <motion.div
              key="roles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {roles.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(r)}
                  className="cursor-pointer"
                >
                  <Card className={`p-8 border-2 ${r.border} hover:shadow-card transition-smooth bg-card text-center`}>
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mx-auto mb-4 shadow-soft`}>
                      <r.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${r.text}`}>{r.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Continue as {r.label.toLowerCase()}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-8 border-2 border-primary/15 shadow-card bg-card">
                <button
                  onClick={() => setRole(null)}
                  className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Change role
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Logging in as</p>
                    <p className={`font-semibold ${role.text}`}>{role.label}</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@school.edu" value={email} onChange={e => setEmail(e.target.value)} className="pl-9 border-primary/20 focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type={showPwd ? "text" : "password"} placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} className="pl-9 pr-9 border-primary/20 focus:border-primary" />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox /> <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <button type="button" className="text-primary hover:underline">Forgot password?</button>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full gradient-primary text-white shadow-glow border-0 py-6 text-base">{loading ? "Logging in..." : "Login"}</Button>

                  <p className="text-center text-sm text-muted-foreground">
                    New to EduSphere? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
                  </p>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
