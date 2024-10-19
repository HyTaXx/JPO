import ProjectForm from '../components/ProjectForm';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@components";

function AddProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    const formDataObj:any = {};
    console.log(formData);
    formDataObj.title = formData.title;
    formDataObj.description = formData.description;
    formDataObj.authors = JSON.stringify(formData.authors);
    formDataObj.tags =  JSON.stringify(formData.tags);
    if (formData.mediaFile) formDataObj.append("media", formData.mediaFile);

    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch('https://directus-ucmn.onrender.com/items/jpo_project', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
      });

      const data = await response.json();
      setProjectData(data.data);
      setIsSubmitting(false);
      navigate('/'); // Redirige vers la page d'accueil après le succès
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating project:", error);
    }
  };

  if (isLoading || isSubmitting) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ajouter un projet</h1>
      <ProjectForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddProject;