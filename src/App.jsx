import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home";
import DashboardLayout from "./layout/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);
