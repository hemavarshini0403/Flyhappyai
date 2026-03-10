import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import RegisterComplaint from "./pages/RegisterComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./pages/Chatbot";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: UserLogin },
      { path: "signup", Component: UserSignup },
      { path: "register", Component: RegisterComplaint },
      { path: "track", Component: TrackComplaint },
      { path: "chatbot", Component: Chatbot },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "documentation", Component: Documentation },
      { path: "*", Component: NotFound },
    ],
  },
]);
