import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, ClipboardList, CalendarCheck,
  BookCheck, Megaphone, MessageSquare, Calendar, Bell, Send, TrendingUp, AlertTriangle, Flower2, Music, CheckCircle, Clock, MoreHorizontal, Plus, Search, FileText, CheckSquare, XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
import DashboardSidebar, { NavItem } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/teacher-dashboard?tab=dashboard", icon: LayoutDashboard },
  { label: "My Classes", to: "/teacher-dashboard?tab=classes", icon: Users },
  { label: "Assignments", to: "/teacher-dashboard?tab=assignments", icon: ClipboardList },
  { label: "Attendance", to: "/teacher-dashboard?tab=attendance", icon: CalendarCheck },
  { label: "Gradebook", to: "/teacher-dashboard?tab=gradebook", icon: BookCheck },
  { label: "Announcements", to: "/teacher-dashboard?tab=announcements", icon: Megaphone },
  { label: "Messages", to: "/teacher-dashboard?tab=messages", icon: MessageSquare },
  { label: "Schedule", to: "/teacher-dashboard?tab=schedule", icon: Calendar },
  { label: "Meditation", to: "/teacher-dashboard?tab=meditation", icon: Flower2 },
];

// Removed hardcoded stats and students

const subjects = [
  { name: "Maths", value: 79, fill: "#7C3AED" },
  { name: "Science", value: 72, fill: "#3B82F6" },
  { name: "English", value: 85, fill: "#10B981" },
  { name: "History", value: 64, fill: "#EC4899" },
  { name: "Computer", value: 91, fill: "#F59E0B" },
];

const assignments = [
  { title: "Chapter 5 — Algebra Quiz", due: "May 2, 2025", count: 28 },
  { title: "Lab Report — Photosynthesis", due: "May 4, 2025", count: 24 },
  { title: "Essay — Independence Era", due: "May 6, 2025", count: 30 },
];

const classList = [
  { id: 1, name: "Class 10-A", subject: "Mathematics", students: 34, avg: "82%", time: "09:00 AM", status: "Active" },
  { id: 2, name: "Class 10-B", subject: "Science", students: 32, avg: "76%", time: "10:30 AM", status: "Upcoming" },
  { id: 3, name: "Class 9-A", subject: "Mathematics", students: 35, avg: "88%", time: "12:00 PM", status: "Completed" },
  { id: 4, name: "Class 8-C", subject: "Science", students: 28, avg: "71%", time: "02:00 PM", status: "Completed" },
];

const messagesList = [
  { id: 1, sender: "Rahul's Parent", preview: "Hi Dr. Sharma, Rahul has been struggling with algebra...", time: "10:30 AM", unread: true },
  { id: 2, sender: "Sneha Shah", preview: "Ma'am, I have submitted the assignment online.", time: "Yesterday", unread: false },
  { id: 3, sender: "Principal Office", preview: "Staff meeting scheduled for Friday at 4 PM.", time: "Mon", unread: false },
];

const announcementsList = [
  { id: 1, title: "Upcoming Science Fair", date: "April 30, 2026", body: "Students who wish to participate must submit their names by tomorrow." },
  { id: 2, title: "Math Assignment Deadline Extended", date: "April 28, 2026", body: "The chapter 5 assignment deadline is pushed to Friday." },
];

const scheduleList = [
  { id: 1, time: "09:00 AM - 10:00 AM", class: "10-A", subject: "Mathematics", room: "Room 101", type: "Lecture" },
  { id: 2, time: "10:30 AM - 11:30 AM", class: "10-B", subject: "Science", room: "Lab 2", type: "Practical" },
  { id: 3, time: "12:00 PM - 01:00 PM", class: "9-A", subject: "Mathematics", room: "Room 105", type: "Lecture" },
  { id: 4, time: "02:00 PM - 03:00 PM", class: "8-C", subject: "Science", room: "Room 202", type: "Lecture" },
];

export default function TeacherDashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "dashboard";

  const [analytics, setAnalytics] = useState({
    avg_attendance: 0,
    avg_score: 0,
    avg_engagement: 0,
    total_students: 0,
    students: [] as any[]
  });

  useEffect(() => {
    authAPI.getTeacherAnalytics().then(res => {
      setAnalytics(res);
    }).catch(console.error);
  }, []);

  const stats = [
    { label: "Total Students", value: analytics.total_students.toString(), change: "Live MongoDB Data", icon: Users, color: "bg-primary-soft text-primary" },
    { label: "Avg Attendance", value: analytics.avg_attendance + "%", change: "Across all students", icon: CalendarCheck, color: "bg-accent-soft text-accent" },
    { label: "Avg Engagement", value: analytics.avg_engagement.toString(), change: "AI Computed", icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
    { label: "Class Avg Score", value: analytics.avg_score + "/100", change: "Live Performance", icon: BookCheck, color: "bg-secondary-soft text-secondary" },
  ];

  return (
    <div className="min-h-screen bg-background mandala-bg">
      <DashboardSidebar items={navItems} accentColor="secondary" />
      <div className="lg:pl-[220px] pt-14 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {currentTab === "dashboard" && (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center text-white font-bold text-xl shadow-gold">DS</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome, Dr. Sharma!</h1>
                <p className="text-muted-foreground text-sm">Class 10-A · Mathematics & Science</p>
              </div>
            </div>
            <Button variant="outline" size="icon" className="rounded-full border-primary/20 hidden md:flex"><Bell className="w-4 h-4 text-primary" /></Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-5 border-2 border-primary/10 shadow-soft hover:shadow-card transition-smooth">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                    {(() => {
                      const Icon = s.icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                  <p className="text-xs text-emerald-600 mt-1">{s.change}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6 mb-8 gradient-primary border-0 shadow-glow text-white relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">📢 Send a class announcement</h3>
                <p className="text-white/90 text-sm">Reach 128 students and parents instantly</p>
              </div>
              <Button className="bg-white text-primary hover:bg-white/90 shadow-card"><Send className="w-4 h-4 mr-2" /> Send Notice</Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 border-2 border-primary/10 shadow-soft">
              <h3 className="font-semibold mb-4">Student Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-muted-foreground text-xs uppercase tracking-wider">
                    <tr className="border-b border-primary/10">
                      <th className="text-left py-2">Student</th>
                      <th className="text-center py-2">Score</th>
                      <th className="text-center py-2">Attend</th>
                      <th className="text-right py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.students.length > 0 ? analytics.students.map(s => (
                      <tr key={s.name} className="border-b border-primary/5 last:border-0 hover:bg-gray-50">
                        <td className="py-3 font-medium">{s.name}</td>
                        <td className="py-3 text-center">{s.score}</td>
                        <td className="py-3 text-center">{s.attendance}%</td>
                        <td className="py-3 text-right">
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${s.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : s.status === 'On Track' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-red-100 text-red-700 border-red-300'}`}>{s.status}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="py-4 text-center text-gray-500">No students found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary/10 shadow-soft">
              <h3 className="font-semibold mb-4">Subject-wise Average</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={subjects} layout="vertical">
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} width={70} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ddd" }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {subjects.map((s, i) => <Cell key={i} fill={s.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6 border-2 border-primary/10 shadow-soft">
            <h3 className="font-semibold mb-4">Upcoming Assignments</h3>
            <div className="space-y-3">
              {assignments.map(a => (
                <div key={a.title} className="flex items-center justify-between p-3 rounded-xl bg-primary-soft/40 hover:bg-primary-soft transition-smooth">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center"><ClipboardList className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="font-medium text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground">Due {a.due}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary-soft text-secondary font-medium">{a.count} students</span>
                </div>
              ))}
            </div>
          </Card>
            </>
          )}

          {currentTab === "classes" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Classes</h2>
                <Button className="rounded-full"><Plus className="w-4 h-4 mr-2" /> Add Class</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classList.map(c => (
                  <Card key={c.id} className="p-6 border-2 border-primary/10 hover:border-primary/30 transition-smooth shadow-soft">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{c.name}</h3>
                        <p className="text-sm text-primary font-medium">{c.subject}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-700' : c.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-400" /> {c.students} Students</div>
                      <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-gray-400" /> {c.avg} Avg</div>
                    </div>
                    <Button variant="outline" className="w-full">View Class Details</Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {currentTab === "assignments" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Assignments</h2>
                <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"><Plus className="w-4 h-4 mr-2" /> Create Assignment</Button>
              </div>
              <Card className="border-2 border-primary/10 shadow-soft overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Submissions</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {assignments.map((a, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><FileText className="w-4 h-4" /></div>
                          {a.title}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{a.due}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(a.count / 34) * 100}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600">{a.count}/34</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">Grade</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {currentTab === "attendance" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Today's Attendance</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 border-2 border-primary/10 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Class 10-A Roster</h3>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search student..." className="pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {analytics.students.slice(0, 5).map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">{s.name.charAt(0)}</div>
                          <span className="font-medium text-gray-900">{s.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className={`rounded-full px-4 border-green-200 hover:bg-green-50 ${s.attendance > 50 ? 'bg-green-50 border-green-500 text-green-700' : ''}`}><CheckCircle className="w-4 h-4 mr-1" /> Present</Button>
                          <Button size="sm" variant="outline" className={`rounded-full px-4 border-red-200 hover:bg-red-50 ${s.attendance <= 50 ? 'bg-red-50 border-red-500 text-red-700' : ''}`}><XCircle className="w-4 h-4 mr-1" /> Absent</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="space-y-6">
                  <Card className="p-6 bg-primary text-white border-0 shadow-glow">
                    <h3 className="font-semibold mb-2">Daily Summary</h3>
                    <div className="text-4xl font-bold mb-1">{analytics.avg_attendance}%</div>
                    <p className="text-white/80 text-sm">Present today across all classes</p>
                  </Card>
                  <Card className="p-6 border-2 border-orange-100 bg-orange-50/50 shadow-soft">
                    <h3 className="font-semibold text-orange-800 mb-2">Attention Needed</h3>
                    <p className="text-sm text-orange-700 mb-4">Arjun More has been absent for 3 consecutive days.</p>
                    <Button size="sm" variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-100">Contact Parents</Button>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === "gradebook" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Gradebook</h2>
              <Card className="p-0 border-2 border-primary/10 shadow-soft overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="px-6 py-4 border-r border-gray-100">Student Name</th>
                      <th className="px-6 py-4">Quiz 1</th>
                      <th className="px-6 py-4">Midterm</th>
                      <th className="px-6 py-4">Lab 1</th>
                      <th className="px-6 py-4 bg-indigo-50 text-indigo-700 border-l border-indigo-100">Final Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {analytics.students.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium border-r border-gray-100">{s.name}</td>
                        <td className="px-6 py-4">{(s.score * 0.9).toFixed(0)}</td>
                        <td className="px-6 py-4">{s.score}</td>
                        <td className="px-6 py-4">{(s.score * 1.1 > 100 ? 100 : s.score * 1.1).toFixed(0)}</td>
                        <td className="px-6 py-4 font-bold bg-indigo-50/30 text-indigo-700 border-l border-indigo-100">{s.score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {currentTab === "announcements" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Announcements</h2>
                <Button className="rounded-full"><Megaphone className="w-4 h-4 mr-2" /> New Post</Button>
              </div>
              <div className="grid gap-6 max-w-3xl">
                {announcementsList.map(a => (
                  <Card key={a.id} className="p-6 border-2 border-primary/10 shadow-soft">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg">{a.title}</h3>
                      <span className="text-xs text-muted-foreground">{a.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{a.body}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Edit</button>
                      <button className="text-xs font-medium text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {currentTab === "messages" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Messages</h2>
              <Card className="border-2 border-primary/10 shadow-soft divide-y divide-gray-100 max-w-4xl">
                {messagesList.map(m => (
                  <div key={m.id} className={`p-4 flex gap-4 hover:bg-gray-50 cursor-pointer transition ${m.unread ? 'bg-indigo-50/30' : ''}`}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 border border-indigo-200">
                      <span className="font-bold text-indigo-700">{m.sender.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`font-semibold text-gray-900 truncate ${m.unread ? 'font-bold' : ''}`}>{m.sender}</h4>
                        <span className={`text-xs whitespace-nowrap ml-2 ${m.unread ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}>{m.time}</span>
                      </div>
                      <p className={`text-sm truncate ${m.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{m.preview}</p>
                    </div>
                    {m.unread && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full self-center"></div>}
                  </div>
                ))}
              </Card>
            </motion.div>
          )}

          {currentTab === "schedule" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Weekly Schedule</h2>
              <div className="relative border-l-2 border-indigo-100 ml-4 pl-6 space-y-8 max-w-3xl py-4">
                {scheduleList.map((s, i) => (
                  <div key={s.id} className="relative">
                    <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-white border-4 border-indigo-500 shadow-sm"></div>
                    <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition group relative overflow-hidden">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.type === 'Lecture' ? 'bg-indigo-500' : 'bg-pink-500'}`}></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-1">
                            <Clock className="w-4 h-4" /> {s.time}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">{s.class} — {s.subject}</h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                            <span>📍 {s.room}</span>
                            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 font-medium">{s.type}</span>
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-5 h-5" /></Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentTab === "meditation" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[80vh] flex flex-col items-center justify-center text-center rounded-3xl p-8 relative overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}>
              <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="text-9xl mb-8 drop-shadow-xl z-10">
                🧘‍♀️
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 z-10">Teacher's Zen Space</h2>
              <p className="text-xl text-gray-700 mb-10 max-w-lg z-10 font-medium">Take a moment to breathe. Teaching is a superpower, but even heroes need rest.</p>
              <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-white/40 backdrop-blur-md text-gray-900 hover:bg-white/60 border border-white/50 shadow-xl z-10 font-semibold transition-all hover:scale-105">
                <Music className="w-5 h-5 mr-3 text-pink-600" /> Play Relaxing Soundscape
              </Button>
              
              {/* Floating decorative elements */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
