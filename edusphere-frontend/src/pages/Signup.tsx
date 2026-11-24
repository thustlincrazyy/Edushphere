import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

const DISPOSABLE = ["tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com", "throwaway.email", "yopmail.com", "trashmail.com"];

function passwordStrength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<string>("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const emailStatus = useMemo(() => {
    if (!email) return { valid: false, msg: "" };
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return { valid: false, msg: "Invalid email format" };
    const domain = email.split("@")[1]?.toLowerCase();
    if (DISPOSABLE.includes(domain)) return { valid: false, msg: "Disposable emails are not allowed" };
    return { valid: true, msg: "Valid email" };
  }, [email]);

  const strength = passwordStrength(pwd);
  const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !pwd || !role) return toast.error("Please complete all fields");
    if (!emailStatus.valid) return toast.error(emailStatus.msg);
    if (strength < 2) return toast.error("Password is too weak");
    if (!agree) return toast.error("Please accept the terms");

    try {
      setLoading(true);
      await authAPI.register(name, email, pwd, role);
      toast.success("Account created! Check your email for the OTP.");
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 400);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mandala-bg gradient-hero flex items-center justify-center px-4 py-10">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Join <span className="text-gradient-primary">EduSphere</span></h1>
          <p className="text-muted-foreground text-sm">Create your free account in 30 seconds</p>
        </div>

        <Card className="p-6 md:p-8 border-2 border-primary/15 shadow-card bg-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Full name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="pl-9 border-primary/20" />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9 border-primary/20" />
              </div>
              {email && (
                <div className={`text-xs mt-1 flex items-center gap-1 ${emailStatus.valid ? "text-emerald-600" : "text-red-500"}`}>
                  {emailStatus.valid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {emailStatus.msg}
                </div>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="At least 8 chars, mix letters & numbers" className="pl-9 border-primary/20" />
              </div>
              {pwd && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-muted">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`flex-1 transition-smooth ${i < strength ? strengthColors[strength-1] : "bg-muted"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            <div>
              <Label>I am a</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1 border-primary/20"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox checked={agree} onCheckedChange={v => setAgree(!!v)} className="mt-0.5" />
              <span className="text-muted-foreground">I agree to the <span className="text-primary">Terms</span> and <span className="text-primary">Privacy Policy</span></span>
            </label>

            <Button type="submit" disabled={loading} className="w-full gradient-primary text-white shadow-glow border-0 py-6 text-base">{loading ? "Creating account..." : "Create Account"}</Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
