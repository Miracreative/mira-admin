import {
    ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

interface AuthContext {
    isAuth: boolean;
    login: () => void;
}

export const AuthContext = createContext<AuthContext>({
    isAuth: false,
    login: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(
                sessionStorage.getItem("isAuthenticated") || "false"
            );
        }
        return false;
    });

    useEffect(() => {
        sessionStorage.setItem("isAuthenticated", JSON.stringify(isAuth));
    }, [isAuth]);

    const login = () => {
        setIsAuth(true);
    };

    return (
        <AuthContext.Provider value={{ isAuth, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
