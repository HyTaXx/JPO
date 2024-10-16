import React from "react";
import { useParams, Link } from "react-router-dom";

function ProjectDetail({ data }) {
    const { id } = useParams();
    const project = data.projects.find((proj) => proj.id === parseInt(id));

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
                <strong>Auteurs: </strong>
                {project.auteurs.join(", ")}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <strong>Tags: </strong>
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
        </div>
    );
}

export default ProjectDetail;
