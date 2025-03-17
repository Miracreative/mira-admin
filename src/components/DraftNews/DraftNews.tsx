import { useEffect, useState } from "react";
import { NewsTable } from "../NewsTable/NewsTable";
import { Post } from "../News/News";

export const DraftNews = () => {
    const [news, setNews] = useState<Post[]>([]);
    const [refetch, setRefetch] = useState(false);

    async function fetchdata() {
        const res = await fetch(
            `${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/draft-posts`
        );
        const data = await res.json();
        setNews(data);
    }
    const handleDeleteNews = async (title: string, slug: string) => {
        const isConfirmed = confirm(`Точно удалить черновик ${title}?`);
        if (isConfirmed) {
            const res = await fetch(
                `${
                    import.meta.env.VITE_PUBLIC_API_PATH
                }/api/db/posts/${slug}?draft=true`,
                {
                    method: "DELETE",
                }
            );
            const messageFromServer = await res.text();
            alert(messageFromServer);
            setRefetch(true);
        }
    };

    const handlePublishNews = async (title: string, slug: string) => {
        const isConfirmed = confirm(`Точно опубликовать черновик ${title}?`);
        if (isConfirmed) {
            const res = await fetch(
                `${
                    import.meta.env.VITE_PUBLIC_API_PATH
                }/api/db/draft-posts/${slug}`,
                {
                    method: "POST",
                }
            );
            const messageFromServer = await res.text();
            alert(messageFromServer);
            setRefetch(true);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);
    useEffect(() => {
        if (refetch) {
            fetchdata();
            setRefetch(false);
        }
    }, [refetch]);

    return (
        <NewsTable
            news={news}
            handleDeleteNews={handleDeleteNews}
            handlePublishNews={handlePublishNews}
            isDraft={true}
        />
    );
};
