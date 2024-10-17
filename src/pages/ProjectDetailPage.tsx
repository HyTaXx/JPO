import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAdmin } from "@services";
import { Loader } from "@components";

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`https://directus-ucmn.onrender.com/items/jpo_project/${id}?fields=*, tags.jpo_tags_id.name, medias.*`);
        const data = await response.json();
        setProject(data.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

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

    fetchProject();
    checkAdminStatus();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!project) {
    return <div className="text-gray-800 dark:text-gray-200">Projet non trouvé</div>;
  }

  const { title, description, authors, tags, medias } = project;

  return (
    <div className="p-8 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-[#F08113] dark:text-orange-400 mb-4">{title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <strong>Auteurs : </strong>
        {authors.map((author, index) => `${author.first_name} ${author.last_name}`).join(", ")}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <strong>Tags : </strong>
        {tags.map((tag, index) => (
          <span key={index} className="inline-block bg-[#F08113] dark:bg-orange-400 text-white px-2 py-1 rounded-full mr-2">
            {tag.jpo_tags_id.name}
          </span>
        ))}
      </div>

      {medias && (
        <div className="mb-4">
          <img
            src={`https://directus-ucmn.onrender.com/assets/${medias.file}`}
            alt={medias.title}
            className="w-full h-40 object-cover mb-2 rounded"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">{medias.description}</p>
        </div>
      )}

      {isAdminUser && (
        <div className="p-4 mt-4 border-t border-gray-300 dark:border-gray-700">
          <p className="text-gray-800 dark:text-gray-200">Contenu réservé aux administrateurs.</p>
        </div>
      )}

      <Link to="/" className="text-[#F08113] dark:text-orange-400 hover:underline mt-6 block">
        Retour à la liste des projets
      </Link>
    </div>
  );
}

export default ProjectDetail;
