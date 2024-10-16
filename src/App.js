import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import LoginPage from "./pages/LoginPage";
import data from "./fakeData.json";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
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

  const uniqueTags = [
    "All",
    ...new Set(
      data.projects.flatMap((project) =>
        project.tags.map((tag) => tag.name)
      )
    ),
  ];

  const filteredProjects = data.projects.filter((project) => {
    const matchesSearch =
      project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.auteurs.some((auteur) =>
        auteur.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTag =
      selectedTag === "All" ||
      project.tags.some((tag) => tag.name === selectedTag);

    return matchesSearch && matchesTag;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <button
          onClick={toggleDarkMode}
          className="p-2 m-4 text-dark bg-darkIIM rounded-md dark:bg-IIM dark:text-white"
        >
          {darkMode ? "Mode Clair" : "Mode Sombre"}
        </button>

        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProjectListPage
                  data={filteredProjects}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                  uniqueTags={uniqueTags}
                />
              }
            />
            <Route
              path="/project/:id"
              element={<ProjectDetailPage data={data} />}
            />
            <Route
              path="/login"
              element={<LoginPage data={data} />}
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
