import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

export default function VerifyOtp() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [shake, setShake] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 min
  const [resendIn, setResendIn] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as any)?.email || "your email";

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputs.current[i+1]?.focus();
    if (next.every(d => d !== "")) verify(next.join(""));
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i-1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0,6);
    if (!text) return;
    const next = text.split("").concat(Array(6-text.length).fill(""));
    setDigits(next);
    if (text.length === 6) verify(text);
    else inputs.current[text.length]?.focus();
  };

  const verify = async (otp: string) => {
    try {
      await authAPI.verifyOTP(email, otp);
      toast.success("Email verified! Redirecting...");
      setTimeout(() => navigate("/login"), 800);
    } catch (err: any) {
      setShake(true);
      toast.error(err.message || "Incorrect OTP. Try again.");
      setTimeout(() => { setShake(false); setDigits(Array(6).fill("")); inputs.current[0]?.focus(); }, 500);
    }
  };

  const resend = async () => {
    if (resendIn > 0) return;
    try {
      await authAPI.resendOTP(email);
      toast.success("OTP resent to your email");
      setResendIn(30);
      setSecondsLeft(600);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen mandala-bg gradient-hero flex items-center justify-center px-4 py-10">
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth">
        <ArrowLeft className="w-4 h-4" /> Change email
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="p-8 border-2 border-primary/15 shadow-card bg-card text-center">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
            className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground text-sm mb-1">We sent a 6-digit code to</p>
          <p className="text-primary font-semibold mb-6 flex items-center justify-center gap-1">
            <Mail className="w-4 h-4" /> {email}
          </p>

          <div className={`flex justify-center gap-2 mb-6 ${shake ? "animate-shake" : ""}`}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKey(i, e)}
                onPaste={handlePaste}
                className={`w-11 h-14 md:w-12 md:h-14 text-center text-2xl font-bold rounded-xl border-2 ${shake ? "border-red-500 text-red-500" : d ? "border-primary text-primary bg-primary-soft" : "border-primary/20"} focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-smooth`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Code expires in <span className={`font-semibold ${secondsLeft < 60 ? "text-red-500" : "text-primary"}`}>{fmt(secondsLeft)}</span>
          </p>

          <Button
            type="button"
            onClick={resend}
            disabled={resendIn > 0}
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary-soft disabled:opacity-50"
          >
            {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
          </Button>

        </Card>
      </motion.div>
    </div>
  );
}
