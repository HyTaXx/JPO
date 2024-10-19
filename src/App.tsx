import './App.css';
import { Layout } from '@components';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProjectList, ProjectDetail, Login, EditProject, AddProject } from '@pages';
import { AuthProvider } from "./contexts/AuthContext"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProjectList />,
      },
      {
        path: "project/create",
        element: <AddProject />,
      },
      {
        path: "project/:id",
        element: <ProjectDetail />,
      },
      {
        path: "project/:id/edit",
        element: <EditProject />,
      },
      {
        path: "admin",
        element: <div>Admin Page</div>,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
