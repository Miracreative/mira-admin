import { useEffect, useState } from "react";
import { Header } from "../components/Header/Header";
import { useParams } from "react-router";
import { Test } from "../components/Test/Test";

export function EditPostPage() {
    const { news: slug } = useParams();
    const [news, setNews] = useState();
    useEffect(() => {
        async function fetchdata() {
            const res = await fetch(
                `${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/posts/${slug}`
            );
            const data = await res.json();
            setNews(data[0]);
        }
        fetchdata();
    }, []);
    console.log("news", news);
    return (
        <>
            <Header />
            {news && (
                <Test
                    initialData={news}
                    slug={slug as string}
                    type="editNews"
                />
            )}
        </>
    );
}
