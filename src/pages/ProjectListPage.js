import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAdmin } from "../services/authService";
import Loader from "../components/Loader";

function ProjectList({ data, searchTerm, setSearchTerm, selectedTag, setSelectedTag, uniqueTags }) {
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            const accessToken = localStorage.getItem("access_token") || "";
            if (!accessToken) {
                setIsAdminUser(false);
            } else {
                const userIsAdmin = await isAdmin(accessToken);
                setIsAdminUser(userIsAdmin);
            }
            setIsLoading(false);
        };

        checkAdminStatus();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="p-8 bg-white dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-[#F08113] dark:text-orange-400 text-center mb-6">
                Liste des Projets
            </h1>

            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Recherche par titre, auteur ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-96 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
            </div>

            <div className="flex justify-center mb-6">
                <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="p-2 border border-gray-300 rounded shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                    {uniqueTags.map((tag, index) => (
                        <option key={index} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((project) => (
                    <div
                        key={project.id}
                        className="p-6 bg-white dark:bg-gray-800 rounded shadow-lg border border-[#F08113] dark:border-orange-500 transition transform hover:scale-105 hover:shadow-2xl hover:z-10 group"
                    >
                        <h2 className="text-2xl font-bold text-[#F08113] dark:text-orange-400 mb-2">
                            {project.titre}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">{project.description}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <strong>Auteurs : </strong>
                            {project.auteurs.join(", ")}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <strong>Tags : </strong>
                            {project.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-block bg-[#F08113] dark:bg-orange-400 text-white px-2 py-1 rounded-full mr-2"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                        <Link to={`/project/${project.id}`} className="text-[#F08113] dark:text-orange-400 hover:underline">
                            Voir plus
                        </Link>

                        {isAdminUser && (
                            <div className="mt-4">
                                <Link 
                                    to={`/project/${project.id}/edit`} 
                                    className="text-blue-500 hover:underline mr-4"
                                >
                                    Modifier
                                </Link>
                                <button 
                                    className="text-red-500 hover:underline"
                                    onClick={() => console.log(`Supprimer le projet ${project.id}`)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectList;
