import { Route } from "react-router";
import { Routes } from "react-router";
import { ProtectedRoute } from "../ProtectedRoute/ProtectedRoute";
import { Login } from "../../pages/Login";
import { useAuth } from "../../providers/AuthProvider";
import { Home } from "../../pages/Home";
import { AddPostPage } from "../../pages/AddPostPage";
import { EditPostPage } from "../../pages/EditPostPage";

export const Router = () => {
    const { isAuth } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute redirectPath="/login" isAuth={isAuth}>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/add-post"
                element={
                    <ProtectedRoute redirectPath="/login" isAuth={isAuth}>
                        <AddPostPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/news/:news/edit"
                element={
                    <ProtectedRoute redirectPath="/login" isAuth={isAuth}>
                        <EditPostPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};
