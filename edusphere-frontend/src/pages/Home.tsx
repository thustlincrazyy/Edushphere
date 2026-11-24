import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Heart, BarChart3, Trophy, MessageCircle, Globe, Sparkles, Eye,
  Gamepad2, Wind, ListChecks, RotateCcw as Replay, ThumbsUp, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Eye, title: "Emotion Detection", desc: "Real-time AI reads how you feel & adapts.", color: "from-violet-500 to-purple-600" },
  { icon: Brain, title: "Personalized Learning", desc: "Lessons tailored to your unique pace.", color: "from-purple-500 to-pink-500" },
  { icon: Heart, title: "Wellbeing First", desc: "Mental health prioritised in every session.", color: "from-pink-500 to-rose-500" },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track progress with beautiful charts.", color: "from-amber-500 to-orange-500" },
  { icon: Trophy, title: "Gamified Learning", desc: "Earn badges, levels & streaks.", color: "from-yellow-500 to-amber-500" },
  { icon: MessageCircle, title: "AI Doubt Solver", desc: "Instant 24/7 tutor in your pocket.", color: "from-emerald-500 to-teal-500" },
  { icon: Globe, title: "Works Everywhere", desc: "Mobile, tablet & desktop ready.", color: "from-blue-500 to-cyan-500" },
  { icon: Sparkles, title: "Indian Roots", desc: "Built with Indian culture & values.", color: "from-orange-500 to-red-500" },
];

const emotions = [
  { label: "Focused", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { label: "Sleepy", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { label: "Confused", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { label: "Frustrated", color: "bg-red-100 text-red-700 border-red-300" },
  { label: "Neutral", color: "bg-gray-100 text-gray-700 border-gray-300" },
  { label: "Hopeless", color: "bg-purple-100 text-purple-700 border-purple-300" },
  { label: "Bored", color: "bg-pink-100 text-pink-700 border-pink-300" },
];

const emotionActions = [
  { emotion: "Sleepy", icon: Gamepad2, action: "Brain games", desc: "Quick mind-energising puzzles", color: "bg-blue-500" },
  { emotion: "Frustrated", icon: Wind, action: "Breathing exercises", desc: "4-4-4 calm breathing routine", color: "bg-red-500" },
  { emotion: "Bored", icon: ListChecks, action: "Quick quiz", desc: "3 fun questions to engage you", color: "bg-pink-500" },
  { emotion: "Confused", icon: Replay, action: "Review lecture", desc: "Re-watch the tricky section", color: "bg-amber-500" },
  { emotion: "Neutral", icon: ThumbsUp, action: "Good Going!", desc: "Keep up the steady pace", color: "bg-gray-500" },
  { emotion: "Focused", icon: Award, action: "Continue Learning", desc: "You are in the zone — keep going!", color: "bg-emerald-500" },
];

const floatingItems = [
  { icon: '🧠', left: '8%', top: '15%', delay: 0 },
  { icon: '📚', left: '82%', top: '12%', delay: 0.5 },
  { icon: '⭐', left: '75%', top: '72%', delay: 1 },
  { icon: '💡', left: '12%', top: '68%', delay: 1.5 },
  { icon: '🎯', left: '48%', top: '8%', delay: 0.8 },
  { icon: '✏️', left: '88%', top: '42%', delay: 1.2 },
  { icon: '🔬', left: '3%', top: '42%', delay: 0.3 },
  { icon: '🏆', left: '38%', top: '82%', delay: 0.7 },
];

export default function Home() {
  return (
    <div className="min-h-screen mandala-bg gradient-hero">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center justify-center px-4">
        {/* Floating Items */}
        {floatingItems.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl md:text-5xl opacity-40 pointer-events-none hidden md:block z-0"
            style={{ left: item.left, top: item.top }}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut'
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" /> India's first emotion-adaptive learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              opacity: { duration: 0.7, delay: 0.1 },
              y: { duration: 0.7, delay: 0.1 },
              backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }
            }}
            className="text-6xl md:text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] leading-none"
          >
            EduSphere
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 font-light"
          >
            AI-Powered Learning Platform <span className="text-secondary font-medium">·</span> Made for India
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/login">
              <Button size="lg" className="gradient-primary text-white text-lg px-12 py-6 rounded-full shadow-glow hover:shadow-glow hover:scale-105 transition-smooth border-0">
                Login
              </Button>
            </Link>
          </motion.div>


        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why <span className="text-gradient-primary">EduSphere</span>?</h2>
            <p className="text-muted-foreground text-lg">Eight pillars built around the Indian student.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Card className="p-6 h-full border-2 border-primary/10 hover:border-primary/30 hover:shadow-card transition-smooth bg-card">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-soft`}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMOTION CHIPS */}
      <section className="py-20 px-4 bg-card/40">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            We understand <span className="text-gradient-gold">Emotions</span>
          </motion.h2>
          <p className="text-muted-foreground mb-10 text-lg">Our AI adapts in real-time so you never feel stuck.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {emotions.map((e, i) => (
              <motion.span
                key={e.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.08 }}
                className={`px-5 py-2 rounded-full border-2 font-medium ${e.color}`}
              >
                {e.label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* EMOTION ACTIONS */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Smart Interventions</h2>
            <p className="text-muted-foreground text-lg">When you need help, EduSphere acts — not lectures.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {emotionActions.map((a, i) => (
              <motion.div
                key={a.emotion}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="p-6 h-full bg-card border-2 border-primary/10 hover:border-primary/40 transition-smooth shadow-soft hover:shadow-card relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${a.color} opacity-10 -translate-y-12 translate-x-12 group-hover:scale-150 transition-smooth`} />
                  <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center mb-4 shadow-soft`}>
                    <a.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{a.emotion}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-sm font-semibold text-primary">{a.action}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-10 md:p-14 gradient-primary border-0 shadow-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to learn smarter?</h2>
            <p className="text-white/90 text-lg mb-8">Join thousands of Indian students already on EduSphere.</p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 rounded-full shadow-card">
                Get Started Free
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 border-t border-primary/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for Indian Students
          </div>
          <p className="text-xs text-muted-foreground mt-2">© {new Date().getFullYear()} EduSphere · Empowering Bharat through AI</p>
        </div>
      </footer>
    </div>
  );
}
