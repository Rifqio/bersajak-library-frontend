import { createBrowserRouter, Outlet } from "react-router-dom";
import "./App.css";
import { BookLayout, QuizLayout, DashboardLayout } from "./layout";
import HomePage from "./pages/home";
import { BookDetailPage, BookViewerPage } from "./pages/book";
import { MultipleChoicePage, WordCompletionPage } from "./pages/quiz";
import { Page404 } from "./pages/error";
import PresStartQuizPage from "./pages/quiz/prestart-quiz";
import AudioBookPage from "./pages/book/audio-book";
import ErrorBoundary from "./pages/error/ErrorBoundary";
import { NewMultipleChoice } from "./pages/quiz/new-multiple-choice";
import { BookListPage } from "./pages/book/book-list";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <DashboardLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />
      }
    ]
  },
  {
    path: "book",
    element: (
      <ErrorBoundary>
        <BookLayout />
      </ErrorBoundary>
    ),
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
                element: <AudioBookPage />
              }
            ]
          },
          {
            path: ":id",
            element: <BookViewerPage />
          }
        ]
      },
      {
        path: "list",
        element: <BookListPage />
      },
      {
        path: ":id",
        element: <BookDetailPage />
      }
    ]
  },
  {
    path: "quiz",
    element: (
      <ErrorBoundary>
        <QuizLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "multiple-choice",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <PresStartQuizPage />
          },
          {
            path: ":id",
            element: <NewMultipleChoice />
          }
        ]
      },
      {
        path: "word-completion",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <PresStartQuizPage />
          },
          {
            path: ":id",
            element: <WordCompletionPage />
          }
        ]
      }
    ]
  },
  // {
  //   path: "quiz-test/:id",
  //   element: <NewMultipleChoice />
  // },
  {
    path: "*",
    element: <DashboardLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />
      }
    ]
  }
]);
