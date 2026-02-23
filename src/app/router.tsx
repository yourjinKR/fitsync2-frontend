import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layout/RootLayOut";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import LoginTestPage from "./test/LoginTestPage";
import CookiePage from "./pages/CookiePage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { InBodyRecordPage } from "./pages/InBodyRecordPage";
import { ExerciseListPage } from "./pages/ExerciseListPage";
import { ExerciseCreatePage } from "./pages/ExerciseCreatePage";
import { ExerciseDetailPage } from "./pages/ExerciseDetailPage";
import { WorkoutListPage } from "./pages/WorkoutListPage";
import { WorkoutCreatePage } from "./pages/WorkoutCreatePage";
import { WorkoutDetailPage } from "./pages/WorkoutDetailPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/test/login", element: <LoginTestPage /> },
      { path: "/cookie", element: <CookiePage /> },
      { path: "/me", element: <MyPage /> },
      { path: "/me/inbody", element: <InBodyRecordPage /> },
      { path: "/exercises", element: <ExerciseListPage /> },
      { path: "/exercises/new", element: <ExerciseCreatePage /> },
      { path: "/exercises/:exerciseId", element: <ExerciseDetailPage /> },
      { path: "/workouts", element: <WorkoutListPage /> },
      { path: "/workouts/new", element: <WorkoutCreatePage /> },
      { path: "/workouts/:workoutId", element: <WorkoutDetailPage /> },

    ],
    errorElement: <NotFoundPage />
  }
]);
