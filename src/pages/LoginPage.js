import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../services/authService";
import Loader from "../components/Loader"; // Importer le composant Loader

function Login() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Tentative de connexion et obtention du token
            const loginResponse = await axios.post("https://directus-ucmn.onrender.com/auth/login", {
                email,
                password: motDePasse
            });
            const { access_token } = loginResponse.data.data;

            // Utilise la fonction isAdmin pour vérifier le rôle de l'utilisateur
            const userIsAdmin = await isAdmin(access_token);

            setIsLoading(false);

            if (userIsAdmin) {
                // Stocker le token si l'utilisateur est un admin
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("Role", "Administrator");
                navigate("/"); // Redirection après connexion réussie
            } else {
                setErreur("Vous n'avez pas les autorisations nécessaires pour accéder à cette page.");
            }
        } catch (err) {
            setIsLoading(false);
            if (err.response && err.response.data && err.response.data.errors) {
                const messageErreur = err.response.data.errors[0].message;
                setErreur(messageErreur);
            } else {
                setErreur("Une erreur inattendue s'est produite. Veuillez réessayer.");
            }
        }
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow dark:bg-gray-800">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100">Connexion</h2>
                    {erreur && <p className="text-red-500 text-center">{erreur}</p>}
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">Adresse email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Adresse email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="motDePasse" className="sr-only">Mot de passe</label>
                                <input
                                    id="motDePasse"
                                    name="motDePasse"
                                    type="password"
                                    required
                                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Mot de passe"
                                    value={motDePasse}
                                    onChange={(e) => setMotDePasse(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-[#F08113] dark:bg-orange-400 rounded-md hover:bg-[#e07010] dark:hover:bg-orange-500"
                        >
                            Connexion
                        </button>
                    </form>
                </div>
            </div>
            )}
        </>
    );
}

export default Login;
