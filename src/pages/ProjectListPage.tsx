import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "@components";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Fetching projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`https://directus-ucmn.onrender.com/items/jpo_project?fields=*, tags.jpo_tags_id.name, medias.*`);
        const data = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch(`https://directus-ucmn.onrender.com/items/jpo_tags`);
        const data = await response.json();
        const tagNames = data.data.map((tag) => tag.name);
        setTags(["All", ...tagNames]);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchProjects();
    fetchTags();
    setIsLoading(false);
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.authors.some((author) =>
        `${author.first_name} ${author.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTag =
      selectedTag === "All" ||
      (project.tags && project.tags.some((tag) => tag.jpo_tags_id.name === selectedTag));

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
        <Link
          to="#projects-section"
          className="bg-[#F08113] dark:bg-orange-400 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-md hover:bg-[#cf6f0c] dark:hover:bg-orange-300 transition"
        >
          Découvrez nos Projets
        </Link>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
