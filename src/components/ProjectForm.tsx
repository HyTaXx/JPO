import { useState, useEffect } from "react";

function ProjectForm({ projectData = {}, onSubmit }) {
    const [title, setTitle] = useState(projectData.title || "");
    const [description, setDescription] = useState(projectData.description || "");
    const [authors, setAuthors] = useState(projectData.authors || [{ first_name: "", last_name: "" }]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(projectData.tags ? projectData.tags.map(tag => tag.jpo_tags_id.name) : []);
    const [mediaFile, setMediaFile] = useState(null);

    // Fetch tags for selection
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch(`https://directus-ucmn.onrender.com/items/jpo_tags`);
                const data = await response.json();
                setTags(data.data.map(tag => tag.name));
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchTags();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            title,
            description,
            authors,
            tags: selectedTags,
            mediaFile
        };
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-900 rounded shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Titre du projet</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-300"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-300"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Auteurs</label>
                {authors.map((author, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                        <input
                            type="text"
                            placeholder="Prénom"
                            value={author.first_name}
                            onChange={(e) => {
                                const updatedAuthors = [...authors];
                                updatedAuthors[index].first_name = e.target.value;
                                setAuthors(updatedAuthors);
                            }}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-300"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nom"
                            value={author.last_name}
                            onChange={(e) => {
                                const updatedAuthors = [...authors];
                                updatedAuthors[index].last_name = e.target.value;
                                setAuthors(updatedAuthors);
                            }}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-300"
                            required
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => setAuthors([...authors, { first_name: "", last_name: "" }])}
                    className="text-blue-500 mt-2"
                >
                    + Ajouter un auteur
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <select
                    multiple
                    value={selectedTags}
                    onChange={(e) => setSelectedTags([...e.target.selectedOptions].map(option => option.value))}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-300"
                >
                    {tags.map((tag, index) => (
                        <option key={index} value={tag}>{tag}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Média</label>
                <input
                    type="file"
                    onChange={(e) => setMediaFile(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-300"
                />
            </div>

            <button
                type="submit"
                className="bg-[#F08113] text-white p-2 rounded hover:bg-orange-500 transition"
            >
                {projectData.id ? "Mettre à jour le projet" : "Ajouter le projet"}
            </button>
        </form>
    );
}

export default ProjectForm;
