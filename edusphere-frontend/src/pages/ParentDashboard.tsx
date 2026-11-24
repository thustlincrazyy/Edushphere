import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, CalendarCheck, FileText, Bell, MessageSquare,
  CreditCard, Award, Bookmark, CheckCircle, Clock, Send, AlertTriangle, IndianRupee
} from "lucide-react";
import DashboardSidebar, { NavItem } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/parent-dashboard?tab=dashboard", icon: LayoutDashboard },
  { label: "Progress", to: "/parent-dashboard?tab=progress", icon: TrendingUp },
  { label: "Attendance", to: "/parent-dashboard?tab=attendance", icon: CalendarCheck },
  { label: "Report Card", to: "/parent-dashboard?tab=report", icon: FileText },
  { label: "Notices", to: "/parent-dashboard?tab=notices", icon: Bell },
  { label: "Message Teacher", to: "/parent-dashboard?tab=message", icon: MessageSquare },
  { label: "Fee Payment", to: "/parent-dashboard?tab=fees", icon: CreditCard },
];

const stats = [
  { label: "Overall Score", value: "88/100", change: "+5%", icon: Award, color: "bg-primary-soft text-primary" },
  { label: "Attendance", value: "94%", change: "+2%", icon: CalendarCheck, color: "bg-accent-soft text-accent" },
  { label: "Class Rank", value: "3rd", change: "Top 5%", icon: TrendingUp, color: "bg-secondary-soft text-secondary" },
  { label: "Enrolled Courses", value: "4", change: "All active", icon: Bookmark, color: "bg-pink-100 text-pink-600" },
];

const subjectsProgress = [
  { name: "Mathematics", value: 72, fill: "#A78BFA" },
  { name: "Science", value: 55, fill: "#F59E0B" },
  { name: "English", value: 88, fill: "#10B981" },
  { name: "History", value: 40, fill: "#EC4899" },
  { name: "Computer", value: 91, fill: "#3B82F6" },
];

const week = [
  { day: "Mon", val: 1, fill: "#10B981" },
  { day: "Tue", val: 1, fill: "#10B981" },
  { day: "Wed", val: 1, fill: "#EF4444" },
  { day: "Thu", val: 1, fill: "#10B981" },
  { day: "Fri", val: 1, fill: "#10B981" },
  { day: "Sat", val: 1, fill: "#10B981" },
];

const notices = [
  { title: "Exam timetable released", date: "Today", color: "bg-primary" },
  { title: "Parent–Teacher Meeting · May 3", date: "In 5 days", color: "bg-secondary" },
  { title: "Annual Sports Day · May 10", date: "In 12 days", color: "bg-accent" },
  { title: "School closed on May 1 (Labour Day)", date: "Reminder", color: "bg-gray-400" },
];

const reportCard = [
  { subject: "Mathematics", q1: 64, midterm: 70, q3: 75, final: 72, grade: "B+" },
  { subject: "Science", q1: 50, midterm: 52, q3: 55, final: 55, grade: "C+" },
  { subject: "English", q1: 85, midterm: 88, q3: 90, final: 88, grade: "A" },
  { subject: "History", q1: 38, midterm: 40, q3: 42, final: 40, grade: "C" },
  { subject: "Computer", q1: 88, midterm: 90, q3: 93, final: 91, grade: "A+" },
];

const fees = [
  { term: "Term 1 – June 2025", amount: "₹12,500", status: "Paid", date: "June 3, 2025" },
  { term: "Term 2 – November 2025", amount: "₹12,500", status: "Paid", date: "Nov 5, 2025" },
  { term: "Term 3 – March 2026", amount: "₹12,500", status: "Due", date: "Due May 10, 2026" },
];

const attendanceLog = [
  { date: "April 29", status: "Present", subject: "All" },
  { date: "April 28", status: "Present", subject: "All" },
  { date: "April 27", status: "Absent", subject: "Mathematics, English" },
  { date: "April 26", status: "Present", subject: "All" },
  { date: "April 25", status: "Present", subject: "All" },
  { date: "April 24", status: "Present", subject: "All" },
];

export default function ParentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "dashboard";

  return (
    <div className="min-h-screen bg-background mandala-bg">
      <DashboardSidebar items={navItems} accentColor="accent" />
      <div className="lg:pl-[220px] pt-14 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">

          {/* ── DASHBOARD HOME ── */}
          {currentTab === "dashboard" && (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-soft">MP</div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Hello, Mrs. Patil!</h1>
                  <p className="text-muted-foreground text-sm">Here's how Neha is doing this week 🌸</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="p-5 border-2 border-primary/10 shadow-soft hover:shadow-card transition-smooth">
                      <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                      <p className="text-3xl font-bold mt-1">{s.value}</p>
                      <p className="text-xs text-emerald-600 mt-1">{s.change}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 border-2 border-primary/10 shadow-soft">
                  <h3 className="font-semibold mb-4">Weekly Attendance</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={week}>
                      <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ddd" }} formatter={(v: any, _n, p: any) => [p.payload.fill === "#EF4444" ? "Absent" : "Present", "Status"]} />
                      <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                        {week.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm mt-3 px-3 py-2 rounded-lg bg-red-50 text-red-600 inline-block">⚠️ 1 absence this week (Wednesday)</p>
                </Card>

                <Card className="p-6 border-2 border-primary/10 shadow-soft">
                  <h3 className="font-semibold mb-4">School Notices</h3>
                  <div className="space-y-3">
                    {notices.map(n => (
                      <div key={n.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-soft/40 transition-smooth">
                        <div className={`w-3 h-3 rounded-full ${n.color} flex-shrink-0`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* ── PROGRESS ── */}
          {currentTab === "progress" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Neha's Academic Progress</h2>
              <Card className="p-6 border-2 border-primary/10 shadow-soft">
                <h3 className="font-semibold mb-6">Subject-wise Score</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={subjectsProgress} layout="vertical">
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v: any) => [`${v}%`, "Score"]} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {subjectsProgress.map((s, i) => <Cell key={i} fill={s.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjectsProgress.map(s => (
                  <Card key={s.name} className="p-5 border-2 border-primary/10 shadow-soft">
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold">{s.name}</p>
                      <p className="font-bold" style={{ color: s.fill }}>{s.value}%</p>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.value}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ background: s.fill }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── ATTENDANCE ── */}
          {currentTab === "attendance" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Attendance Log</h2>
              <div className="grid grid-cols-3 gap-4 mb-2">
                <Card className="p-5 text-center border-2 border-green-100 bg-green-50 shadow-soft">
                  <p className="text-3xl font-bold text-green-600">94%</p>
                  <p className="text-sm text-green-700 mt-1">Overall Rate</p>
                </Card>
                <Card className="p-5 text-center border-2 border-blue-100 bg-blue-50 shadow-soft">
                  <p className="text-3xl font-bold text-blue-600">112</p>
                  <p className="text-sm text-blue-700 mt-1">Days Present</p>
                </Card>
                <Card className="p-5 text-center border-2 border-red-100 bg-red-50 shadow-soft">
                  <p className="text-3xl font-bold text-red-600">7</p>
                  <p className="text-sm text-red-700 mt-1">Days Absent</p>
                </Card>
              </div>
              <Card className="border-2 border-primary/10 shadow-soft divide-y divide-gray-100">
                {attendanceLog.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${a.status === "Present" ? "bg-green-100" : "bg-red-100"}`}>
                      {a.status === "Present"
                        ? <CheckCircle className="w-5 h-5 text-green-600" />
                        : <AlertTriangle className="w-5 h-5 text-red-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{a.date}</p>
                      <p className="text-xs text-gray-500">{a.subject}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${a.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </Card>
            </motion.div>
          )}

          {/* ── REPORT CARD ── */}
          {currentTab === "report" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Report Card — Neha Patil</h2>
              <Card className="p-4 bg-primary text-white border-0 shadow-glow flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Academic Year 2025–26</p>
                  <p className="text-2xl font-bold mt-1">Class 10-A · Roll No: 14</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">Overall Grade</p>
                  <p className="text-4xl font-extrabold">A</p>
                </div>
              </Card>
              <Card className="p-0 border-2 border-primary/10 shadow-soft overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Q1</th>
                      <th className="px-6 py-4">Midterm</th>
                      <th className="px-6 py-4">Q3</th>
                      <th className="px-6 py-4">Final</th>
                      <th className="px-6 py-4 bg-indigo-50 text-indigo-700">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportCard.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{r.subject}</td>
                        <td className="px-6 py-4">{r.q1}</td>
                        <td className="px-6 py-4">{r.midterm}</td>
                        <td className="px-6 py-4">{r.q3}</td>
                        <td className="px-6 py-4 font-semibold">{r.final}</td>
                        <td className="px-6 py-4 bg-indigo-50/30 font-bold text-indigo-700">{r.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {/* ── NOTICES ── */}
          {currentTab === "notices" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">School Notices</h2>
              <div className="grid gap-5 max-w-3xl">
                {notices.map((n, i) => (
                  <Card key={i} className="p-6 border-2 border-primary/10 shadow-soft flex gap-4 items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${n.color}`} />
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{n.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-3.5 h-3.5" /> {n.date}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── MESSAGE TEACHER ── */}
          {currentTab === "message" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold">Message Teacher</h2>
              <Card className="p-6 border-2 border-primary/10 shadow-soft space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                  <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary">
                    <option>Dr. Sharma — Mathematics & Science</option>
                    <option>Ms. Verma — English</option>
                    <option>Mr. Singh — History</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input type="text" defaultValue="Regarding Neha's Math performance" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea rows={5} defaultValue="Dear Dr. Sharma, I noticed Neha's Math score dropped in Q1. Could we schedule a meeting to discuss how to improve? Thank you." className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none" />
                </div>
                <Button className="w-full rounded-full gradient-primary text-white border-0 shadow-glow">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </Card>
              <Card className="p-5 bg-emerald-50 border-2 border-emerald-100">
                <p className="text-sm font-semibold text-emerald-800 mb-1">✉️ Previous Message Sent</p>
                <p className="text-xs text-emerald-700">"Regarding Science Lab assignment deadline" — April 22, 2026</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Replied ✓</p>
              </Card>
            </motion.div>
          )}

          {/* ── FEE PAYMENT ── */}
          {currentTab === "fees" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Fee Payment</h2>
              <Card className="p-6 bg-amber-50 border-2 border-amber-200 shadow-soft flex items-center justify-between">
                <div>
                  <p className="text-amber-800 font-semibold">Term 3 Fee Due</p>
                  <p className="text-3xl font-extrabold text-amber-700 mt-1">₹12,500</p>
                  <p className="text-xs text-amber-600 mt-1">Due by May 10, 2026</p>
                </div>
                <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-md">
                  <IndianRupee className="w-4 h-4 mr-2" /> Pay Now
                </Button>
              </Card>
              <Card className="border-2 border-primary/10 shadow-soft divide-y divide-gray-100">
                {fees.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-5 hover:bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900">{f.term}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{f.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{f.amount}</p>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full mt-1 inline-block ${f.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {f.status === "Paid" ? "✓ Paid" : "⚠ Due"}
                      </span>
                    </div>
                  </div>
                ))}
              </Card>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
