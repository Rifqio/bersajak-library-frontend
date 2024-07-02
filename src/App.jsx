import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home";
import DashboardLayout from "./layout/DashboardLayout";
import BookDetailPage from "./pages/book/book-detail";
import BookLayout from "./layout/BookLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      // {
      //   path: "/book/:id",
      //   element: <BookDetailPage />,
      // },
    ],
  },
  {
    path: "book",
    element: <BookLayout />,
    children: [
      {
        path: ":id",
        element: <BookDetailPage />,
      },
    ],
  },
]);
