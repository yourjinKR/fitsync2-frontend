import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { router } from "./app/router";
import { QueryProvider } from "./app/providers/QueryProvider";
import { GlobalStyle } from "./app/shared/styles/GlobalStyle";
import { theme } from "./app/shared/styles/theme";
import { applyThemeMode, getInitialThemeMode } from "./app/shared/lib/themeMode";

applyThemeMode(getInitialThemeMode());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </ThemeProvider>
);
