import { createBrowserRouter, Outlet } from "react-router-dom";
import "./App.css";
import { BookLayout, QuizLayout, DashboardLayout } from "./layout";
import HomePage from "./pages/home";
import { BookDetailPage, BookViewerPage } from "./pages/book";
import { MultipleChoicePage, WordCompletionPage } from "./pages/quiz";
import { Page404 } from "./pages/error";
import PresStartQuizPage from "./pages/quiz/prestart-quiz";
import AudioBookPage from "./pages/book/audio-book";

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
        path: "read",
        element: <Outlet />,
        children: [
          {
            path: "audio",
            element: <Outlet />,
            children: [
              {
                path: ":id",
                element: <AudioBookPage />,
              },
            ],
          },
          {
            path: ":id",
            element: <BookViewerPage />,
          },
        ],
      },
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
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <PresStartQuizPage />,
          },
          {
            path: ":id",
            element: <MultipleChoicePage />,
          },
        ],
      },
      {
        path: "word-completion",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <PresStartQuizPage />,
          },
          {
            path: ":id",
            element: <WordCompletionPage />,
          },
        ],
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
