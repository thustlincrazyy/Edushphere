import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

/* -------------------- SLEEPY: Memory Match -------------------- */
const SYMBOLS = ["🪷", "🦚", "🥁", "🎻", "🪔", "🌺", "🐘", "🐅"];
export function SleepyGame({ open, onClose }: Props) {
  const [cards, setCards] = useState<{ id: number; sym: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [time, setTime] = useState(300);

  useEffect(() => {
    if (!open) return;
    const symbols = SYMBOLS.slice(0, 6);
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((sym, id) => ({ id, sym, flipped: false, matched: false }));
    setCards(deck);
    setFlipped([]);
    setTime(300);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [open]);

  const handleFlip = (i: number) => {
    if (flipped.length === 2 || cards[i].matched || flipped.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setTimeout(() => {
        if (cards[next[0]].sym === cards[next[1]].sym) {
          setCards(c => c.map((card, idx) => next.includes(idx) ? { ...card, matched: true } : card));
        }
        setFlipped([]);
      }, 700);
    }
  };

  const allMatched = cards.length > 0 && cards.every(c => c.matched);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">😴 Wake up your brain!</h2>
          <p className="text-sm text-muted-foreground mb-4">Match the Indian symbols · {Math.floor(time/60)}:{String(time%60).padStart(2,"0")}</p>
          <div className="grid grid-cols-4 gap-2">
            {cards.map((c, i) => {
              const show = c.matched || flipped.includes(i);
              return (
                <button
                  key={c.id}
                  onClick={() => handleFlip(i)}
                  className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-smooth ${show ? "gradient-primary text-white" : "bg-primary-soft hover:bg-primary/20"} ${c.matched ? "opacity-60" : ""}`}
                >
                  {show ? c.sym : "?"}
                </button>
              );
            })}
          </div>
          {allMatched && <p className="mt-4 text-emerald-600 font-medium">🎉 All matched! You're refreshed.</p>}
          <Button onClick={onClose} className="mt-5 gradient-primary text-white border-0">Back to learning</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- FRUSTRATED: Breathing -------------------- */
export function BreathingExercise({ open, onClose }: Props) {
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (!open) return;
    setPhase("Inhale"); setCount(4);
    const t = setInterval(() => {
      setCount(c => {
        if (c > 1) return c - 1;
        setPhase(p => p === "Inhale" ? "Hold" : p === "Hold" ? "Exhale" : "Inhale");
        return 4;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-0 overflow-hidden p-0">
        <div className="relative p-8 text-center bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500 text-white">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 100 Q50 50 100 100 T200 100\" stroke=\"white\" fill=\"none\" stroke-width=\"2\"/%3E%3C/svg%3E')" }} />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-2">Take a deep breath 🌿</h2>
            <p className="text-white/80 text-sm mb-8">4-4-4 breathing routine</p>
            <motion.div
              animate={{ scale: phase === "Inhale" ? 1.4 : phase === "Hold" ? 1.4 : 0.8 }}
              transition={{ duration: phase === "Hold" ? 0 : 4, ease: "easeInOut" }}
              className="w-40 h-40 rounded-full bg-white/20 border-4 border-white mx-auto flex flex-col items-center justify-center backdrop-blur-sm"
            >
              <p className="text-3xl font-bold">{phase}</p>
              <p className="text-5xl font-extrabold mt-1">{count}</p>
            </motion.div>
            <Button onClick={onClose} className="mt-8 bg-white text-emerald-600 hover:bg-white/90">I feel better 💚</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- BORED: Quiz -------------------- */
const QUIZ = [
  { q: "What is the capital of India?", opts: ["Mumbai", "Delhi", "Kolkata", "Chennai"], a: 1 },
  { q: "Solve: 12 × 8 = ?", opts: ["86", "96", "106", "108"], a: 1 },
  { q: "Who wrote the Indian National Anthem?", opts: ["Tagore", "Gandhi", "Nehru", "Bose"], a: 0 },
];
export function QuickQuiz({ open, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { if (open) { setIdx(0); setScore(0); setPicked(null); setDone(false); } }, [open]);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === QUIZ[idx].a) setScore(s => s + 1);
    setTimeout(() => {
      if (idx === QUIZ.length - 1) setDone(true);
      else { setIdx(idx + 1); setPicked(null); }
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {!done ? (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Question {idx+1} of {QUIZ.length}</p>
            <h2 className="text-xl font-bold mb-5">{QUIZ[idx].q}</h2>
            <div className="space-y-2">
              {QUIZ[idx].opts.map((o, i) => {
                const isCorrect = i === QUIZ[idx].a;
                const isPicked = i === picked;
                let cls = "border-primary/15 hover:border-primary hover:bg-primary-soft";
                if (picked !== null && isCorrect) cls = "border-emerald-500 bg-emerald-50 text-emerald-700";
                else if (isPicked && !isCorrect) cls = "border-red-500 bg-red-50 text-red-600";
                return (
                  <button key={i} onClick={() => pick(i)} className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-smooth flex items-center justify-between ${cls}`}>
                    {o}
                    {picked !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {isPicked && !isCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Sparkles className="w-12 h-12 text-secondary mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-1">Quiz complete!</h2>
            <p className="text-3xl text-gradient-primary font-extrabold mb-4">{score}/{QUIZ.length}</p>
            <Button onClick={onClose} className="gradient-primary text-white border-0">Back to Learning</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- CONFUSED: Review -------------------- */
export function ReviewSuggestion({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <div className="text-5xl mb-3">🤔</div>
        <h2 className="text-2xl font-bold mb-2">Looking a bit confused?</h2>
        <p className="text-muted-foreground mb-6">No worries! Want to review the last few minutes of the lecture? It often helps to watch tricky parts twice.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose} className="border-primary/30">I understand</Button>
          <Button onClick={onClose} className="gradient-primary text-white border-0">Review Lecture</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- HOPELESS: Motivation -------------------- */
export function HopelessMotivation({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-0 overflow-hidden p-0">
        <div className="p-8 text-center text-white" style={{ background: "linear-gradient(135deg, #FF9933 0%, #FF6B35 50%, #C71585 100%)" }}>
          <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white mx-auto mb-4 flex items-center justify-center text-6xl backdrop-blur-sm">🇮🇳</div>
          <p className="text-sm uppercase tracking-widest mb-1 opacity-80">Dr. APJ Abdul Kalam</p>
          <p className="text-lg font-semibold leading-snug mb-3">"सपने वो नहीं जो हम सोते समय देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।"</p>
          <p className="text-sm italic opacity-90 mb-6">"Dreams are not what you see in sleep — dreams are what don't let you sleep."</p>
          <Button onClick={onClose} className="bg-white text-orange-600 hover:bg-white/90 font-semibold">I am motivated now! 🔥</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- LOOKING AWAY: Story -------------------- */
const STORY = [
  { emoji: "🦁", text: "A proud lion was sleeping when a tiny mouse ran over his face." },
  { emoji: "🐭", text: "The lion caught the mouse but spared its life. The mouse promised to repay him." },
  { emoji: "🪤", text: "Days later, the lion was trapped in a hunter's net and roared in despair." },
  { emoji: "✂️", text: "The mouse heard, came running, and chewed through the ropes — saving the lion." },
];
export function LookingAwayStory({ open, onClose }: Props) {
  const [page, setPage] = useState(0);
  useEffect(() => { if (open) setPage(0); }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <p className="text-xs text-secondary uppercase tracking-widest mb-1 font-semibold">Panchatantra · {page+1}/{STORY.length}</p>
        <h2 className="text-xl font-bold mb-4">The Lion and the Mouse</h2>
        <motion.div key={page} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8 text-center mb-4">
          <div className="text-7xl mb-4">{STORY[page].emoji}</div>
          <p className="text-sm text-foreground/80">{STORY[page].text}</p>
        </motion.div>
        {page === STORY.length - 1 ? (
          <div>
            <p className="text-sm font-semibold text-primary mb-3">🌟 Moral: Even the smallest friend can be the greatest help. Stay focused — every effort counts!</p>
            <Button onClick={onClose} className="w-full gradient-primary text-white border-0">Let's come back to study</Button>
          </div>
        ) : (
          <Button onClick={() => setPage(p => p + 1)} className="w-full gradient-primary text-white border-0">Next →</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- NEUTRAL: Toast helper -------------------- */
export function showNeutralToast() {
  toast.success("Good Going! Keep it up! 🌟", { duration: 3000, position: "bottom-right" });
}

/* -------------------- FOCUSED: Badge -------------------- */
export function FocusedBadge({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-glow flex items-center gap-2 z-50"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-medium text-sm">You're in the zone! Continue Learning ✨</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
