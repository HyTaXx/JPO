import ProjectForm from '../components/ProjectForm';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "@components";

function EditProject() {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      const accessToken = localStorage.getItem("access_token");
      
      try {
        const response = await fetch(`https://directus-ucmn.onrender.com/items/jpo_project/${id}?fields=*, tags.jpo_tags_id.name, medias.*`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        setProjectData(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleSubmit = async (formData) => {
    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("authors", JSON.stringify(formData.authors));
    formDataObj.append("tags", JSON.stringify(formData.tags));
    if (formData.mediaFile) formDataObj.append("media", formData.mediaFile);

    const accessToken = localStorage.getItem("access_token");

    try {
      await fetch(`https://directus-ucmn.onrender.com/items/jpo_project/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formDataObj
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Modifier le projet</h1>
      <ProjectForm projectData={projectData} onSubmit={handleSubmit} />
    </div>
  );
}

export default EditProject;
