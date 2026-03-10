import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { FileText, LogOut, MessageSquare, Plane, Search, UserCircle } from "lucide-react";
import { clearUserSession, getUserSession, type UserSession } from "./utils/storage";

const navItems = [
  { to: "/register", label: "Register Complaint", icon: FileText },
  { to: "/track", label: "Track Complaint", icon: Search },
  { to: "/chatbot", label: "Help Assistant", icon: MessageSquare },
  { to: "/documentation", label: "Documentation", icon: FileText },
];

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [userSession, setUserSession] = useState<UserSession | null>(() => getUserSession());

  useEffect(() => {
    setUserSession(getUserSession());
  }, [location.pathname]);

  useEffect(() => {
    function syncUserSession() {
      setUserSession(getUserSession());
    }

    window.addEventListener("storage", syncUserSession);
    window.addEventListener("focus", syncUserSession);
    return () => {
      window.removeEventListener("storage", syncUserSession);
      window.removeEventListener("focus", syncUserSession);
    };
  }, []);

  function handleLogout() {
    clearUserSession();
    setUserSession(null);
    navigate("/");
  }

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-100">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="sticky top-0 z-40 border-b border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(79,70,229,0.08)] backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-18 items-center justify-between gap-6 py-3">
            <Link to="/" className="group flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: -8, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200"
              >
                <Plane className="h-5 w-5" />
              </motion.div>
              <div>
                <div className="text-xl font-bold tracking-tight text-gray-900">FlyHappy</div>
                <div className="text-xs uppercase tracking-[0.24em] text-indigo-500">Passenger Support</div>
              </div>
            </Link>

            <div className="hidden items-center gap-2 rounded-2xl border border-indigo-100 bg-white/70 p-1.5 shadow-sm lg:flex">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.06 * index }}
                    className="relative"
                  >
                    <Link
                      to={item.to}
                      className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                        active ? "text-indigo-700" : "text-gray-600 hover:text-indigo-700"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-xl bg-indigo-50 shadow-inner"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className="relative z-10 flex items-center gap-2"
                      >
                        <Icon className={`h-4 w-4 ${active ? "text-indigo-600" : "text-gray-400"}`} />
                        <span>{item.label}</span>
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {userSession?.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-3 rounded-2xl border border-indigo-100 bg-white/80 px-3 py-2 shadow-sm sm:flex">
                  {userSession.avatarUrl ? (
                    <img
                      src={userSession.avatarUrl}
                      alt={userSession.name || userSession.email}
                      className="h-9 w-9 rounded-full border border-indigo-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                      <UserCircle className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {userSession.name || userSession.email}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-indigo-500">
                      {userSession.authProvider === "google" ? "Google account" : "Signed in"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/signup" className="hidden rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-white/80 hover:text-indigo-700 sm:block">
                  Sign Up
                </Link>
                <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <footer className="mt-12 border-t border-gray-200 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">Copyright 2026 FlyHappy - AI-Powered Airline Grievance Redressal System</p>
            <p className="mt-2 text-xs">Final Year B.Tech Project | AI & Data Science</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
