import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { router } from "./app/router";
import { QueryProvider } from "./app/providers/QueryProvider";
import { GlobalStyle } from "./app/shared/styles/GlobalStyle";
import { theme } from "./app/shared/styles/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>
);