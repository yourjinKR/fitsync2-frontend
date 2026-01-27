import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layout/RootLayOut";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> }
    ],
    errorElement: <NotFoundPage />
  }
]);