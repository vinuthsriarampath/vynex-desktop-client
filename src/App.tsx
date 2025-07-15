import { HashRouter, } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/common/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { UserProvider } from "./contexts/userContext";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider>
        <HashRouter>
          <Toaster position="top-center" expand={false} richColors />
          <AppRoutes />
        </HashRouter>
      </UserProvider>
    </ThemeProvider>

  )
}

export default App