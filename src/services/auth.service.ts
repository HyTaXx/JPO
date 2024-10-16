import axios from "axios";
export const isAdmin = async (accessToken: string) => {
  try {
    const userResponse = await axios.get("https://directus-ucmn.onrender.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const { role } = userResponse.data.data;
    const roleResponse = await axios.get(`https://directus-ucmn.onrender.com/roles/${role}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const { name } = roleResponse.data.data;
    return name === "Administrator";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};