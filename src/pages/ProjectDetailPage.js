import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { isAdmin } from "../services/authService";
import Loader from "../components/Loader";

function ProjectDetail({ data }) {
    const { id } = useParams();
    const project = data.projects.find((proj) => proj.id === parseInt(id));

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

    if (!project) {
        return <div className="text-gray-800 dark:text-gray-200">Projet non trouvé</div>;
    }

    return (
        <div className="p-8 bg-white dark:bg-gray-900">
            <Link to="/" className="text-[#F08113] dark:text-orange-400 hover:underline mb-4 inline-block">
                Retour à la liste
            </Link>
            <h1 className="text-4xl font-bold text-[#F08113] dark:text-orange-400 mb-4">{project.titre}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <strong>Auteurs : </strong>
                {project.auteurs.join(", ")}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <strong>Tags : </strong>
                {project.tags.map((tag) => (
                    <span key={tag.id} className="inline-block bg-[#F08113] dark:bg-orange-400 text-white px-2 py-1 rounded-full mr-2">
                        {tag.name}
                    </span>
                ))}
            </div>
            <div className="mb-4">
                {project.medias.map((media) => (
                    <div key={media.id} className="mb-4">
                        <img
                            src={media.media_url}
                            alt={media.title}
                            className="w-full h-40 object-cover mb-2 rounded"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">{media.description}</p>
                    </div>
                ))}
            </div>
            
            {isAdminUser && (
                <div className="p-4 mt-4 border-t border-gray-300 dark:border-gray-700">
                    <p className="text-gray-800 dark:text-gray-200">Contenu réservé aux administrateurs.</p>
                </div>
            )}
        </div>
    );
}

export default ProjectDetail;
