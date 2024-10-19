import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { isAdmin } from "../services/auth.service"; // Import the isAdmin function
import { useAuth } from "../contexts/AuthContext"; // Import useAuth from AuthContext
import { Loader } from "@components"; // Import a Loader component if you have one

export default function Layout() {
  const { isUserAdmin, setIsAdmin } = useAuth(); // Destructure isUserAdmin and setIsAdmin from context
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state to wait for setup
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");

    // Initialize dark mode setting based on localStorage or system preference
    if (storedTheme) {
      setDarkMode(storedTheme === "true");
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDarkMode);
      localStorage.setItem("darkMode", prefersDarkMode.toString());
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      isAdmin(accessToken)
        .then((userIsAdmin) => {
          setIsAdmin(userIsAdmin); // Update admin state from context
        })
        .catch((error) => {
          console.error("Erreur lors de la vérification du statut administrateur :", error);
          setIsAdmin(false);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading once setup is done
        });
    } else {
      setIsAdmin(false);
      setIsLoading(false); // Stop loading if no access token
    }
  }, [setIsAdmin]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", (!prev).toString());
      return !prev;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("Role");
    setIsAdmin(false); // Update admin status in context
    navigate("/"); // Redirect to the home page
  };

  if (isLoading) {
    return <Loader />; // Display a loader until data is loaded
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <header className="flex justify-between items-center h-16 px-8 select-none">
          <nav>
            <Link className="text-dark dark:text-white" to="/">
              Accueil
            </Link>
            {isUserAdmin && (
              <Link className="text-dark dark:text-white ml-4" to="/admin">
                Panneau Admin
              </Link>
            )}
          </nav>
          <div className="flex gap-4">
            {isUserAdmin ? (
              <button onClick={handleLogout} className="text-dark dark:text-white">
                Déconnexion
              </button>
            ) : (
              <Link to="/login" className="text-dark dark:text-white">
                Connexion
              </Link>
            )}
            <button
              onClick={toggleDarkMode}
              className="text-dark bg-darkIIM rounded-md dark:bg-IIM dark:text-white"
            >
              {darkMode ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
