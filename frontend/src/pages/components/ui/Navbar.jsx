// frontend/src/components/ui/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth() || {};
  const nav = useNavigate();

  return (
    <nav className="
      bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
      backdrop-blur-lg bg-opacity-80
      shadow-xl
      px-6 py-4
      flex items-center justify-around
      sticky top-0 z-50
    ">
      <div className="flex items-center space-x-6 ">
        <Link
          to="/"
          className="text-white text-2xl font-extrabold tracking-wide drop-shadow-lg"
        >
          CampusConnect
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {["announcements", "calendar", "resources"].map((route) => (
            <Link
              key={route}
              to={`/${route}`}
              className="
                text-white/90 hover:text-white 
                transition font-medium
                hover:scale-110
              "
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-white font-medium">{user.name}</span>
            <button
              onClick={() => {
                logout();
                nav("/login");
              }}
              className="
                px-4 py-2 rounded-lg bg-white text-purple-700
                shadow-md font-semibold
                hover:bg-purple-100 transition
              "
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="
              px-4 py-2 rounded-lg bg-white text-purple-700
              shadow-md font-semibold
              hover:bg-purple-100 transition
            "
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
