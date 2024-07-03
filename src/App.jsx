import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import { BookLayout, QuizLayout, DashboardLayout } from "./layout";
import HomePage from "./pages/home";
import { BookDetailPage } from "./pages/book";
import { MultipleChoicePage, WordCompletionPage } from "./pages/quiz";
import { Page404 } from "./pages/error";

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
        element: <MultipleChoicePage />,
      },
      {
        path: "word-completion",
        element: <WordCompletionPage />,
      },
    ],
  },
  {
    path: "*",
    element: <DashboardLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
]);
