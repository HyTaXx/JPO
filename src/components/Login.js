import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
            // Attempt to login and get the access token
            const loginResponse = await axios.post("https://directus-ucmn.onrender.com/auth/login", {
                email,
                password: motDePasse
            });
            const { access_token } = loginResponse.data.data;

            // Retrieve user details using the token
            const userResponse = await axios.get("https://directus-ucmn.onrender.com/users/me", {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            const { role } = userResponse.data.data;

            // Check the user's role to see if it's "Administrator"
            const roleResponse = await axios.get(`https://directus-ucmn.onrender.com/roles/${role}`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            const { name } = roleResponse.data.data;
            setIsLoading(false);

            if (name === "Administrator") {
                // Store the token in local storage if the user is an admin
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("Role",name);
                navigate("/"); // Redirect to home page after successful login
            } else {
                setErreur("Vous n'avez pas les autorisations nécessaires pour accéder à cette page.");
            }
        } catch (err) {
            setIsLoading(false);
            // Extract error message from the response
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
            <div role="status" class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <svg aria-hidden="true" class="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-[#FF6934]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
          ) :

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
        }
        </>
      );
}

export default Login;
