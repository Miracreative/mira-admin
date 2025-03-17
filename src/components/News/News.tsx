import { useEffect, useState } from "react";
import { NewsTable } from "../NewsTable/NewsTable";

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

export type Post = {
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
            `${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/posts?limit=999`
        );
        const data = await res.json();
        console.log("data", data);
        setNews(data.posts);
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
            const res = await fetch(
                `${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/posts/${slug}`,
                {
                    method: "DELETE",
                }
            );
            const textFromServer = await res.text();
            alert(textFromServer);
            setRefetch(true);
        }
    };
    const handleAddToDraftNews = async (title: string, slug: string) => {
        const isConfirmed = confirm(
            `Точно добавить пост ${title} в черновики?`
        );
        if (isConfirmed) {
            const res = await fetch(
                `${
                    import.meta.env.VITE_PUBLIC_API_PATH
                }/api/db/posts/${slug}/draft`,
                {
                    method: "POST",
                }
            );
            const textFromServer = await res.text();
            alert(textFromServer);
            setRefetch(true);
        }
    };

    return (
        <NewsTable
            news={news}
            handleDeleteNews={handleDeleteNews}
            handleAddToDraftNews={handleAddToDraftNews}
        />
    );
};
