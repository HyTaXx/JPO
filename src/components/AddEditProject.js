import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddEditProject() {
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [auteurs, setAuteurs] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [medias, setMedias] = useState([]);
    const [keyOrder, setKeyOrder] = useState(1);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        } else {
            axios.get("/path/to/api/check-admin", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (!response.data.isAdmin) {
                    navigate("/login");
                }
            })
            .catch(() => {
                navigate("/login");
            });
        }

        // Fetch tags for tag options
        axios.get("/path/to/api/tags")
            .then(response => setTagOptions(response.data))
            .catch(error => console.log(error));

        // If editing an existing project, fetch its data
        if (id) {
            axios.get(`/path/to/api/projects/${id}`)
                .then(response => {
                    const project = response.data;
                    setTitre(project.titre);
                    setDescription(project.description);
                    setAuteurs(project.auteurs);
                    setSelectedTags(project.tags.map(tag => tag.id));
                    setMedias(project.medias);
                    setKeyOrder(project.key_order);
                })
                .catch(error => console.log(error));
        }
    }, [id, navigate]);

    const handleTagChange = (tagId) => {
        setSelectedTags(prevSelectedTags =>
            prevSelectedTags.includes(tagId)
                ? prevSelectedTags.filter(id => id !== tagId)
                : [...prevSelectedTags, tagId]
        );
    };

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        const type = file.type.startsWith("video/") ? "video" : "image";
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        
        axios.post("/path/to/api/media-upload", formData)
            .then(response => {
                setMedias([...medias, {
                    id: response.data.id,
                    title: file.name,
                    description: "",
                    media_url: response.data.media_url,
                    type: type,
                    key_order: medias.length + 1
                }]);
            })
            .catch(error => console.log(error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const projectData = {
            titre,
            description,
            auteurs,
            key_order: keyOrder,
            tags: selectedTags,
            medias: medias.map(media => ({ id: media.id, key_order: media.key_order }))
        };

        const apiCall = id
            ? axios.put(`/path/to/api/projects/${id}`, projectData)
            : axios.post("/path/to/api/projects", projectData);

        apiCall
            .then(() => navigate("/"))
            .catch((err) => setError("Une erreur est survenue. Veuillez réessayer."));
    };

    return (
        <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
            <h1 className="text-4xl font-bold mb-4">{id ? "Modifier le Projet" : "Ajouter un Projet"}</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Titre</label>
                    <input
                        type="text"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Auteurs</label>
                    <input
                        type="text"
                        value={auteurs.join(", ")}
                        onChange={(e) => setAuteurs(e.target.value.split(",").map(a => a.trim()))}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Liste des auteurs, séparés par des virgules"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Tags</label>
                    {tagOptions.map(tag => (
                        <label key={tag.id} className="inline-block mr-2">
                            <input
                                type="checkbox"
                                checked={selectedTags.includes(tag.id)}
                                onChange={() => handleTagChange(tag.id)}
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Média</label>
                    <input type="file" onChange={handleMediaUpload} />
                </div>
                <button
                    type="submit"
                    className="bg-[#F08113] dark:bg-orange-400 text-white px-4 py-2 rounded"
                >
                    {id ? "Mettre à jour" : "Ajouter"} le Projet
                </button>
            </form>
        </div>
    );
}

export default AddEditProject;
