import { HashRouter, } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/common/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ThemeProvider>

  )
}

export default App