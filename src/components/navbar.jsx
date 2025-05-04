import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Globe } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"
        >
          <Globe className="h-6 w-6" />
          <span>Geo Atlas</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="text-sm px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 rounded border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
