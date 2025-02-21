import { Link } from "react-router";
import cls from "./Header.module.scss";

export const Header = () => {
    return (
        <header className={cls.header}>
            <nav>
                <ul className={cls.list}>
                    <li>
                        <Link to="/">Все новости</Link>
                    </li>
                    <li>
                        <Link to="/add-post">Добавить новость</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
