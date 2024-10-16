import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");

    if (storedTheme) {
      setDarkMode(storedTheme === "true");
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDarkMode);
      localStorage.setItem("darkMode", prefersDarkMode.toString());
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <header
          className="flex justify-between items-center h-16 px-8 select-none"
        >
          <nav>
            <Link
              className="text-dark dark:text-white"
              to="/"
            >
              Home
            </Link>
          </nav>
          <div
            className="flex gap-4"
          >
            <Link
              to="/login"
              className="text-dark dark:text-white"
            >
              Login
            </Link>
            <button
              onClick={toggleDarkMode}
              className="text-dark bg-darkIIM rounded-md dark:bg-IIM dark:text-white"
            >
              {darkMode ?
                <Moon className="h-[1.2rem] w-[1.2rem]" /> :
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              }
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  )
}