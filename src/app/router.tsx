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
      { path: "/me/inbody", element: <InBodyRecordPage /> }

    ],
    errorElement: <NotFoundPage />
  }
]);