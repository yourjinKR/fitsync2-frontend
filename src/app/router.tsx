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
      { path: "/test/exercises", element: <ExerciseListPage /> },
      { path: "/test/exercises/new", element: <ExerciseCreatePage /> },
      { path: "/test/exercises/:exerciseId", element: <ExerciseDetailPage /> },
      { path: "/test/workouts", element: <WorkoutListPage /> },
      { path: "/test/workouts/new", element: <WorkoutCreatePage /> },
      { path: "/test/workouts/:workoutId", element: <WorkoutDetailPage /> },

    ],
    errorElement: <NotFoundPage />
  }
]);
