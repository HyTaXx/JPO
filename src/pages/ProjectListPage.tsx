import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "@components";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth context

interface Project {
  id: number;
  title: string | null;
  description: string | null;
  authors: { first_name: string | null; last_name: string | null }[];
  tags: { jpo_tags_id: { name: string | null } }[];
}

function ProjectList() {
  const { isUserAdmin } = useAuth(); // Destructure isUserAdmin from useAuth
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<string[]>(["All"]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(`https://directus-ucmn.onrender.com/items/jpo_project?fields=*, tags.jpo_tags_id.name, medias.*`);
      const data = await response.json();
      setProjects(data.data || []);
    };

    const fetchTags = async () => {
      const response = await fetch(`https://directus-ucmn.onrender.com/items/jpo_tags`);
      const data = await response.json();
      const tagNames = data.data.map((tag: { name: string }) => tag.name);
      setTags(["All", ...tagNames]);
    };

    const fetchData = async () => {
      try {
        await Promise.all([fetchProjects(), fetchTags()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`https://directus-ucmn.onrender.com/items/jpo_project/${id}`, {
        method: "DELETE",
      });
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (project.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (project.authors?.some((author) =>
        `${author.first_name || ''} ${author.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      ) || false);
  
    const matchesTag =
      selectedTag === "All" ||
      (project.tags && project.tags.some((tag) => tag.jpo_tags_id?.name === selectedTag));
  
    return matchesSearch && matchesTag;
  });  

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-[#F08113] dark:text-orange-400 mb-4">
          Découvrez l'Innovation et la Créativité de Demain
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Nos étudiants repoussent les limites de la créativité et de la technologie. Explorez leurs projets, des œuvres qui transforment leurs idées en réalisations concrètes et innovantes. Embarquez dans cette aventure et découvrez le talent de demain.
        </p>
      </header>

      <div id="projects-section" className="flex flex-col md:flex-row justify-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Recherche par titre, auteur ou description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-full w-full md:w-96 shadow-md dark:bg-gray-700 dark:text-white dark:border-gray-600 transition focus:ring-2 focus:ring-[#F08113]"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-3 border border-gray-300 rounded-full shadow-md dark:bg-gray-700 dark:text-white dark:border-gray-600 transition focus:ring-2 focus:ring-[#F08113]"
        >
          {tags.map((tag, index) => (
            <option key={index} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[#F08113] dark:border-orange-500 transform hover:scale-105 hover:shadow-2xl hover:z-10 transition duration-300 ease-in-out group"
          >
            <h2 className="text-3xl font-semibold text-[#F08113] dark:text-orange-400 mb-3">
              {project.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {project.description}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              <strong>Auteurs :</strong> {project.authors.map(author => `${author.first_name} ${author.last_name}`).join(", ")}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <strong>Tags :</strong>{" "}
              {project.tags && project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-[#F08113] dark:bg-orange-400 text-white px-3 py-1 rounded-full mr-2"
                >
                  {tag.jpo_tags_id.name}
                </span>
              ))}
            </div>
            <Link to={`/project/${project.id}`} className="text-[#F08113] dark:text-orange-400 font-medium hover:underline">
              Voir plus
            </Link>
            {isUserAdmin && (
              <div className="flex mt-4 gap-2">
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
                <Link to={`/project/${project.id}/edit`} className="text-blue-500 hover:text-blue-700">
                  Modifier
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
