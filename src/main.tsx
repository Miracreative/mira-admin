import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Router } from "./components/Router/Router.tsx";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </BrowserRouter>
);
