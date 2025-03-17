import { useEffect, useState } from "react";
import { Header } from "../components/Header/Header";
import { useParams, useSearchParams } from "react-router";
import { EDITOR } from "../components/Editor/Editor";

export function EditPostPage() {
    const { news: slug } = useParams();
    const [data] = useSearchParams();
    const isDraft = data.get("isdraft") === "true" ? true : false;
    const [news, setNews] = useState();
    useEffect(() => {
        async function fetchdata() {
            const res = await fetch(
                `${
                    import.meta.env.VITE_PUBLIC_API_PATH
                }/api/db/posts/${slug}?isdraft=${isDraft ? "true" : "false"}`
            );
            const data = await res.json();
            setNews(data[0]);
        }
        fetchdata();
    }, []);
    return (
        <>
            <Header />
            {news && (
                <EDITOR
                    isDraft={isDraft}
                    initialData={news}
                    slug={slug}
                    editorType="edit"
                />
            )}
        </>
    );
}
