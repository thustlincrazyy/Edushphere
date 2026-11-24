import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Sparkles, LucideIcon, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface Props {
  items: NavItem[];
  accentColor?: "primary" | "secondary" | "accent";
}

export default function DashboardSidebar({ items, accentColor = "primary" }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const accent = accentColor === "secondary" ? "text-secondary" : accentColor === "accent" ? "text-accent" : "text-primary";

  const sidebarContent = (
    <>
      <div className="px-6 py-6">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold text-gradient-primary">EduSphere</span>
        </NavLink>
      </div>

      <nav className="px-3 flex-1 overflow-y-auto scrollbar-thin">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-smooth ${
                isActive || location.pathname === item.to
                  ? "bg-primary-soft text-primary shadow-soft"
                  : "text-muted-foreground hover:bg-primary-soft/50 hover:text-primary"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-primary/10 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm font-medium text-muted-foreground hover:bg-primary-soft/50 hover:text-primary transition-smooth">
          <HelpCircle className="w-4 h-4" /> Support
        </button>
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-smooth">
          <LogOut className="w-4 h-4" /> Logout
        </NavLink>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-card border-b border-primary/10 z-40 flex items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-gradient-primary">EduSphere</span>
        </NavLink>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-primary-soft">
          {mobileOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
        </button>
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-[220px] bg-card border-r border-primary/10 flex-col z-30 shadow-soft">
        {sidebarContent}
      </aside>

      {/* Mobile slide-in */}
      {mobileOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          className="lg:hidden fixed top-14 left-0 bottom-0 w-[260px] bg-card border-r border-primary/10 z-40 flex flex-col shadow-card"
        >
          {sidebarContent}
        </motion.aside>
      )}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/40 z-30 top-14" />
      )}
    </>
  );
}
