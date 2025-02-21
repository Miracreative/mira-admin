import cls from "./LoginForm.module.scss";
import { SubmitButton } from "../SubmitButton/SubmitButton";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router";

type ResponseResult = {
    message: string;
    isAuth: boolean;
};

export const LoginForm = () => {
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const onSubmit = async (formData: FormData) => {
        const data = {
            login: formData.get("login"),
            password: formData.get("password"),
        };
        const response = await fetch(
            `${import.meta.env.VITE_PUBLIC_API_PATH}/api/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        const result = (await response.json()) as ResponseResult;
        setMessage(result.message);

        if (result.isAuth) {
            login();
            navigate("/");
        }
    };
    const resetMessage = () => {
        setMessage("");
    };

    return (
        <>
            <section className={cls.section}>
                <div className={cls.formWrapper}>
                    <h1 className={cls.title}>Mira CRM</h1>
                    <form action={onSubmit} className={cls.form}>
                        <input
                            className={cls.input}
                            name="login"
                            placeholder="login"
                            required
                            onChange={resetMessage}
                        />
                        <input
                            className={cls.input}
                            placeholder="password"
                            name="password"
                            type="password"
                            required
                            onChange={resetMessage}
                        />
                        <span style={{ color: "red", height: "20px" }}>
                            {message}
                        </span>
                        <SubmitButton className={cls.button} />
                    </form>
                </div>
            </section>
        </>
    );
};
