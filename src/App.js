import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./components/ProjectDetail";
import Login from "./components/Login";
import data from "./fakeData.json";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  // Extract unique tags from the data
  const uniqueTags = [
    "All",
    ...new Set(
      data.projects.flatMap((project) =>
        project.tags.map((tag) => tag.name)
      )
    ),
  ];

  // Filtered projects based on the search term and selected tag
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
    setDarkMode(!darkMode);
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
                <ProjectList
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
              element={<ProjectDetail data={data} />}
            />
            <Route
              path="/login"
              element={<Login data={data} />}
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
