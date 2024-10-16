import './App.css'
import { Layout } from '@components';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProjectList, ProjectDetail, Login, EditProject } from '@pages'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProjectList />
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
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
