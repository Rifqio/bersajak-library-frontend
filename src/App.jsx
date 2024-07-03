import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import { BookLayout, QuizLayout, DashboardLayout } from "./layout";
import HomePage from "./pages/home";
import BookDetailPage from "./pages/book/book-detail";
import { MultipleChoicePage } from "./pages/quiz/multiple-choice";

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
  {
    path: "quiz",
    element: <QuizLayout />,
    children: [
      {
        path: "multiple-choice",
        element: <MultipleChoicePage />
      }
    ]
  },
]);
