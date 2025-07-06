import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="h-screen">
            <header>
                <h1>My App Header</h1>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <p>Footer Content</p>
            </footer>
        </div>
    );
}