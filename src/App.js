// Assuming the JSON is stored in a file called "projects.json" in the root directory
import React, { useState } from "react";
import data from "./fakeData.json";

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");

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

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-500 text-center mb-6">
                Project Listing
            </h1>

            {/* Search bar */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search by title, author, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-96 shadow-sm"
                />
            </div>

            {/* Tag filter */}
            <div className="flex justify-center mb-6">
                <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="p-2 border border-gray-300 rounded shadow-sm"
                >
                    {uniqueTags.map((tag, index) => (
                        <option key={index} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            {/* Project list */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        className="p-6 bg-white rounded shadow-md"
                    >
                        <h2 className="text-2xl font-bold text-blue-600 mb-2">
                            {project.titre}
                        </h2>
                        <p className="text-gray-700 mb-2">
                            {project.description}
                        </p>
                        <div className="text-sm text-gray-500 mb-2">
                            <strong>Auteurs: </strong>
                            {project.auteurs.join(", ")}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                            <strong>Tags: </strong>
                            {project.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                        <img
                            src={project.medias[0]?.media_url}
                            alt={project.medias[0]?.title}
                            className="w-full h-40 object-cover mb-4 rounded"
                        />
                        <p className="text-sm text-gray-500">
                            {project.medias[0]?.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
