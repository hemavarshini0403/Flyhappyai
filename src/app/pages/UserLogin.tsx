import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { Lock, Mail, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { checkUserAuth, setGoogleUserSession, setUserSession } from "../utils/storage";
import { isGoogleOAuthEnabled, parseGoogleCredential } from "../utils/googleAuth";

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const googleEnabled = useMemo(
    () => isGoogleOAuthEnabled(googleClientId),
    [googleClientId]
  );

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (checkUserAuth(email, password)) {
        setUserSession(email);
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error("Enter a valid email and password");
      }
      setLoading(false);
    }, 400);
  }

  function handleGoogleSuccess(credentialResponse: { credential?: string }) {
    if (!credentialResponse.credential) {
      toast.error("Google sign-in did not return a credential");
      return;
    }

    const payload = parseGoogleCredential(credentialResponse.credential);
    if (!payload?.email) {
      toast.error("Failed to read Google account information");
      return;
    }

    setGoogleUserSession({
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.picture,
    });
    toast.success(`Signed in as ${payload.name || payload.email}`);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <UserCircle className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">User Login</h1>
            <p className="text-gray-600 mt-2">Sign in to manage your complaints and updates</p>
          </div>

          <div className="space-y-4">
            {googleEnabled ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google sign-in failed")}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text="signin_with"
                />
              </div>
            ) : (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Google OAuth is not active yet. Set <code>VITE_GOOGLE_CLIENT_ID</code> in a
                local <code>.env</code> file to enable Google sign-in.
              </div>
            )}

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-3 text-sm text-gray-500">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-3">
              New here?{" "}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Create an account
              </Link>
            </p>
            <button onClick={() => navigate("/")} className="text-sm text-indigo-600 hover:text-indigo-700">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
