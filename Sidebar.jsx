import React, { useContext, useState } from "react";
import { Home, FileText, Settings, ChevronLeft, ChevronRight, Book, Menu } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => setMobileOpen(prev => !prev);

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="sm:hidden flex items-center justify-between p-2 bg-green-700 text-white rounded fixed top-4 left-4 z-50 shadow-lg w-auto">
        <h1 className="font-bold text-lg">Notemaker</h1>
        <button onClick={handleMobileToggle}>
          <Menu size={28} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden sm:flex h-screen flex-col transition-all duration-300
          ${isOpen ? "w-64" : "w-16"} bg-green-700 text-white`}
      >
        <div className="flex items-center justify-between p-4">
          {isOpen && <h1 className="text-lg font-bold">Notemaker</h1>}
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-800 rounded">
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="px-3">
          <h1 className="text-lg font-semibold">{user?.username || "Guest"}</h1>
        </div>
        <hr />

        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            {[
              { icon: Home, label: "Home", path: "/notesapp" },
              { icon: FileText, label: "Notes", path: "/notes" },
              { icon: Book, label: "Journal", path: "/journal" },
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-2 hover:bg-green-800 cursor-pointer rounded"
                onClick={() => navigate(item.path)}
              >
                <item.icon size={20} /> {isOpen && <span>{item.label}</span>}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <ul>
            <li
              className="flex items-center gap-2 w-full hover:bg-green-800 p-2 rounded cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <Settings size={20} /> {isOpen && <span>Settings</span>}
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed top-0 left-0 h-full bg-green-700 text-white z-50 transition-transform duration-300 sm:hidden
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full"} flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">Notemaker</h1>
          <button onClick={handleMobileToggle} className="p-2 hover:bg-gray-800 rounded">
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="px-3">
          <h1 className="text-lg font-semibold">{user?.username || "Guest"}</h1>
        </div>
        <hr />

        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            {[
              { icon: Home, label: "Home", path: "/notesapp" },
              { icon: FileText, label: "Notes", path: "/notes" },
              { icon: Book, label: "Journal", path: "/journal" },
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-2 hover:bg-green-800 cursor-pointer rounded"
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
              >
                <item.icon size={20} /> <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <ul>
            <li
              className="flex items-center gap-2 w-full hover:bg-green-800 p-2 rounded cursor-pointer"
              onClick={() => { navigate("/settings"); setMobileOpen(false); }}
            >
              <Settings size={20} /> <span>Settings</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile overlay background */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" onClick={() => setMobileOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
