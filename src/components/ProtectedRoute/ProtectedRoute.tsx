import { Navigate } from "react-router";

type ProtectedRouteProps = {
    isAuth: boolean;
    children: React.ReactNode;
    redirectPath?: string;
};

export const ProtectedRoute = ({
    isAuth,
    children,
    redirectPath = "/",
}: ProtectedRouteProps) => {
    if (!isAuth) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};
