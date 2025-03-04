import { useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Code from "@editorjs/code";
//@ts-expect-error adasd
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
//@ts-expect-error asdas
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import ImageTool from "@editorjs/image";
import { useEffect, useState } from "react";
import styles from "./Test.module.scss"; // Импортируем стили
import { useNavigate } from "react-router";

type InitialData = {
    authorDetails: AuthorInit;
    categoryDetails: CategoryInit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
    titleImage: string;
    subTitle: string;
    title: string;
    _id: string;
};

type AuthorInit = {
    _id: string;
    name: string;
    profession: string;
};

type CategoryInit = {
    _id: string;
    name: string;
};

type Author = {
    id: string;
    name: string;
};

type Category = {
    id: string;
    name: string;
};

type Type = "editNews" | "addNews";

export function Test({
    initialData,
    slug,
    type = "addNews",
}: {
    initialData?: InitialData;
    type: Type;
    slug?: string;
}) {
    const navigate = useNavigate();
    const [data, setData] = useState(
        initialData && JSON.parse(initialData?.content)
    );
    const [editor, setEditor] = useState<EditorJS>();
    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState(
        initialData?.authorDetails?._id || ""
    );
    const [selectedCategory, setSelectedCategory] = useState(
        initialData?.categoryDetails?._id || ""
    );
    const [image, setImage] = useState<File>();
    const [imageName, setImageName] = useState<string | undefined>(
        initialData?.titleImage
    );
    const [title, setTitle] = useState(initialData?.title || "");
    const [subtitle, setSubtitle] = useState(initialData?.subTitle || "");
    const imageRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/authors`)
            .then((response) => response.json())
            .then((data) => {
                const authorsName = data.map(
                    (author: { name: string; _id: string }) => ({
                        id: author._id,
                        name: author.name,
                    })
                );
                setAuthors(authorsName);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке авторов:", error);
            });

        fetch(`${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/categories`)
            .then((response) => response.json())
            .then((data) => {
                const categories = data.map(
                    (cat: { name: string; _id: string }) => ({
                        name: cat.name,
                        id: cat._id,
                    })
                );
                setCategories(categories);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке категорий:", error);
            });
    }, []);
    useEffect(() => {
        const editor = new EditorJS({
            autofocus: true,
            holder: "editorjs",
            data: {
                ...data,
            },
            tools: {
                header: Header,
                list: List,
                code: Code,
                raw: Raw,
                quote: Quote,
                marker: Marker,
                delimiter: Delimiter,
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: `${
                                import.meta.env.VITE_PUBLIC_API_PATH
                            }/api/upload-image`, // Your backend file uploader endpoint
                            byUrl: `${
                                import.meta.env.VITE_PUBLIC_API_PATH
                            }/posts`, // Your endpoint that provides uploading by Url
                        },
                    },
                },
            },
            i18n: {
                messages: {
                    toolNames: {
                        Text: "Параграф",
                        Heading: "Заголовок",
                        List: "Список",
                        Warning: "Примечание",
                        Checklist: "Чеклист",
                        Quote: "Цитата",
                        Code: "Код",
                        Delimiter: "Разделитель",
                        "Raw HTML": "HTML-фрагмент",
                        Table: "Таблица",
                        Link: "Ссылка",
                        Marker: "Маркер",
                        Bold: "Полужирный",
                        Italic: "Курсив",
                        InlineCode: "Моноширинный",
                        Image: "Изображение",
                    },
                },
            },
        });
        setEditor(editor);
    }, []);
    const handleClick = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        // Сохраняем содержимое редактора
        if (editor) {
            editor
                .save()
                .then((outputData) => {
                    setData(outputData);

                    // Создаем объект с данными для отправки
                    formData.append("author", selectedAuthor);
                    formData.append("category", selectedCategory);
                    formData.append("title", title);
                    formData.append("subtitle", subtitle);
                    formData.append("content", JSON.stringify(outputData));
                    console.log("img", image);
                    if (image) {
                        formData.append("image", image); // Добавляем изображение
                    }

                    if (type === "addNews") {
                        fetch(
                            `${
                                import.meta.env.VITE_PUBLIC_API_PATH
                            }/api/db/posts`,
                            {
                                method: "POST",
                                body: formData,
                            }
                        )
                            .then(async (res) => {
                                const data = await res.text();
                                alert(data);
                                navigate("/");
                            })
                            .catch((error) => {
                                console.error("Error posting data:", error);
                            });
                    } else if (type === "editNews") {
                        fetch(
                            `${
                                import.meta.env.VITE_PUBLIC_API_PATH
                            }/api/db/posts/${slug}`,
                            {
                                method: "PUT",
                                body: formData,
                            }
                        )
                            .then(async (res) => {
                                const data = await res.text();
                                alert(data);
                                navigate("/");
                            })
                            .catch((error) =>
                                console.error("Error posting data:", error)
                            );
                    }
                })
                .catch((error) => {
                    console.log("Saving failed: ", error);
                });
        }
    };

    return (
        <>
            <div className={styles.formContainer}>
                <form onSubmit={handleClick}>
                    <p>Автор</p>
                    <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className={styles.formSelect}
                        required>
                        <option disabled hidden value="">
                            Выберите автора
                        </option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.name}
                            </option>
                        ))}
                    </select>
                    <p>Категория</p>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.formSelect}
                        required>
                        <option disabled hidden value="">
                            Выберите категорию
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <p>Заголовок новости</p>
                    <input
                        type="text"
                        className={styles.formInput}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <p>Подзаголовок новости</p>
                    <input
                        type="text"
                        className={styles.formInput}
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        required
                    />
                    <p>Картинка новости</p>
                    <input
                        ref={imageRef}
                        type="file"
                        onChange={(e) => {
                            setImage(e.target.files?.[0]);
                            setImageName(e.target.files?.[0].name);
                        }}
                        accept="image/*"
                        style={{
                            width: 1,
                            height: 1,
                            opacity: 0,
                        }}
                    />
                    <label
                        htmlFor="fileInput"
                        className={styles.uploadButton}
                        onClick={() => imageRef.current?.click()}>
                        Выбрать файл
                    </label>
                    <span className={styles.fileName}>
                        {imageName
                            ? `Выбранный файл: ${imageName}`
                            : "Файл не выбран"}
                    </span>
                    <p>Текст новости</p>
                    <div
                        style={{ backgroundColor: "#f0efef" }}
                        id="editorjs"></div>
                    <button type="submit" className={styles.formButton}>
                        СОХРАНИТЬ
                    </button>
                </form>
            </div>
        </>
    );
}
