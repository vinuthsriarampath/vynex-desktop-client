import { HashRouter, } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/common/theme-provider";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HashRouter>
        <Toaster position="top-center" expand={false} richColors />
        <AppRoutes />
      </HashRouter>
    </ThemeProvider>

  )
}

export default App