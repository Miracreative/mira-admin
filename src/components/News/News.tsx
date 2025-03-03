import { useEffect, useState } from "react";
import cls from "./News.module.scss";
import editIMG from "../../assets/edit-button.svg";

type Author = {
    _id: string;
    name: string;
    profession: string;
};

type Category = {
    _id: string;
    name: string;
};

type ContentBlock = {
    id: string;
    type: string;
    data: {
        text?: string;
        level?: number;
    };
};

type Content = {
    time: number;
    blocks: ContentBlock[];
    version: string;
};

type Post = {
    _id: string;
    title: string;
    subTitle: string;
    slug: string;
    image: string;
    content: Content;
    authorDetails: Author;
    categoryDetails: Category;
};

export const News = () => {
    const [news, setNews] = useState<Post[]>([]);
    const [refetch, setRefetch] = useState(false);

    async function fetchdata() {
        const res = await fetch(
            `${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/posts`
        );
        const data = await res.json();
        setNews(data);
    }

    useEffect(() => {
        fetchdata();
    }, []);
    useEffect(() => {
        if (refetch) {
            fetchdata();
            setRefetch(false);
        }
    }, [refetch]);

    const handleDeleteNews = async (title: string, slug: string) => {
        const isConfirmed = confirm(`Точно удалить пост ${title}?`);
        if (isConfirmed) {
            await fetch(
                `${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/posts/${slug}`,
                {
                    method: "DELETE",
                }
            );
            console.log("in handle");
            setRefetch(true);
        }
    };
    console.log("news", news);
    return (
        <div className={cls.tableContainer}>
            <table className={cls.newsTable}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Заголовок</th>
                        <th>Подзаголовок</th>
                        <th>Автор</th>
                        <th>Редактировать</th>
                        <th className={cls.remove}>Удалить</th>
                    </tr>
                </thead>
                <tbody>
                    {news &&
                        news.map((newsItem, index) => (
                            <tr key={newsItem._id}>
                                <td>{index + 1}</td>
                                <td>{newsItem.title}</td>
                                <td>{newsItem.subTitle}</td>
                                <td>{newsItem.authorDetails?.name}</td>
                                <td>
                                    <a href={`news/${newsItem.slug}/edit`}>
                                        <img
                                            className={cls.edit}
                                            src={editIMG}
                                            width={40}
                                            height={40}
                                            alt="edit"
                                        />
                                    </a>
                                </td>
                                <td
                                    className={cls.deleteBtn}
                                    onClick={() =>
                                        handleDeleteNews(
                                            newsItem.title,
                                            newsItem.slug
                                        )
                                    }>
                                    Удалить
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};
