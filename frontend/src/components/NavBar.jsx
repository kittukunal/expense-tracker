import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For icons
import logo from "../assets/logo.jpeg";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";
  if (hideNavbar) return null;

  return (
    <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between bg-transparent z-10">
      {/* Logo and Title */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="w-10 h-10 rounded-sm" />
        <h1 className="text-white text-xl font-bold">
          EXPENSE<span className="text-blue-400">TRACKER</span>
        </h1>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Button
          className="text-white bg-gradient-to-r from-blue-400 to-violet-950 hover:opacity-90 transition"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
        <Button
          color="primary"
          className="bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-md p-4 rounded-md shadow-lg flex flex-col gap-2 md:hidden z-50">
          <Button
            className="w-full bg-gradient-to-r from-blue-400 to-violet-950 text-white"
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          >
            Login
          </Button>
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              setMenuOpen(false);
              navigate("/register");
            }}
          >
            Register
          </Button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
