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
import { SettingsPage } from "./pages/SettingsPage";
import { ExerciseListPage } from "./pages/test/exercise/ExerciseListPage";
import { ExerciseCreatePage } from "./pages/test/exercise/ExerciseCreatePage";
import { ExerciseDetailPage } from "./pages/test/exercise/ExerciseDetailPage";
import { WorkoutListPage } from "./pages/test/workout/WorkoutListPage";
import { WorkoutCreatePage } from "./pages/test/workout/WorkoutCreatePage";
import { WorkoutDetailPage } from "./pages/test/workout/WorkoutDetailPage";
import MyTestGround from "./pages/test/MyTestGround";
import TestHomePage from "./pages/test/TestHomePage";
import { ChatPage } from "./pages/ChatPage";

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
      { path: "/me/settings", element: <SettingsPage /> },
      { path: "/chat", element: <ChatPage /> },


      { path: "/test/home", element: <TestHomePage /> },
      { path: "/test/my", element: <MyTestGround /> },
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
