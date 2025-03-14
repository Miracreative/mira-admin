import { useNavigate } from "react-router";
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
import cls from "./style.module.scss"; // Импортируем стили

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

type EditorType = "edit" | "add";

type EditorProps = {
    editorType: EditorType;
    initialData?: InitialData;
    slug?: string;
    isDraft: boolean;
};
type SubmitFormType =
    | "post-publish"
    | "post-update"
    | "draft-save"
    | "draft-update";

export function EDITOR({
    initialData,
    slug,
    isDraft,
    editorType = "add",
}: EditorProps) {
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

    const handlePostRequest = async (
        url: string,
        method: "POST" | "PUT",
        formData: FormData,
        submitFormType: SubmitFormType
    ): Promise<void> => {
        try {
            const res = await fetch(url, { method, body: formData });
            const messsageFromServer = await res.text();
            alert(messsageFromServer);
            let navigateUrl = "/";

            if (isDraft) {
                if (submitFormType === "draft-update") {
                    navigateUrl = "/draft";
                }
            } else {
                if (submitFormType === "post-publish") {
                    navigateUrl = "/";
                } else if (submitFormType === "post-update") {
                    navigateUrl = "/";
                } else if (submitFormType === "draft-save") {
                    navigateUrl = "/draft";
                }
            }

            if (res.ok) navigate(navigateUrl);
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };
    const apiPath: string = import.meta.env.VITE_PUBLIC_API_PATH;
    const method: "POST" | "PUT" = editorType === "add" ? "POST" : "PUT";
    const ApiRoutes = {
        AddPostAndPublish: `${apiPath}/api/db/posts`,
        AddPostAndSaveDraft: `${apiPath}/api/db/posts?draft=true`,
        EditPost: `${apiPath}/api/db/posts/${slug}`,
        // EditDraftAndPublish: `${apiPath}/api/db/draft-posts-upload/${slug}`,
        EditDraft: `${apiPath}/api/db/posts/${slug}?draft=true`,
    } as const;

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

    const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitEvent = e.nativeEvent as SubmitEvent;
        const submitFormType = (submitEvent.submitter as HTMLButtonElement)
            ?.value as SubmitFormType;

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
                    if (image) {
                        formData.append("image", image);
                    }
                    let url;

                    if (!isDraft) {
                        if (editorType === "add") {
                            if (submitFormType === "post-publish") {
                                url = ApiRoutes.AddPostAndPublish; // если добавляю пост и публикую
                            } else if (submitFormType === "draft-save") {
                                url = ApiRoutes.AddPostAndSaveDraft; // если добавляю пост и сохраняю в черновик
                            }
                        } else if (editorType === "edit") {
                            url = ApiRoutes.EditPost; // если редактирую пост
                        }
                    } else if (isDraft) {
                        if (editorType === "edit") {
                            if (submitFormType === "draft-update") {
                                url = ApiRoutes.EditDraft; // если редактирую черновик
                            }
                        }
                    }
                    console.log("isDraft", isDraft);
                    console.log("editorType", editorType);
                    console.log("submitFormType", submitFormType);
                    console.log("url", url);

                    handlePostRequest(url!, method, formData, submitFormType);
                })
                .catch((error) => {
                    console.log("Saving failed: ", error);
                });
        }
    };

    return (
        <>
            <div className={cls.formContainer}>
                <form onSubmit={handleClick}>
                    <p>Автор</p>
                    <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className={cls.formSelect}
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
                        className={cls.formSelect}
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
                        className={cls.formInput}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <p>Подзаголовок новости</p>
                    <input
                        type="text"
                        className={cls.formInput}
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
                        className={cls.uploadButton}
                        onClick={() => imageRef.current?.click()}>
                        Выбрать файл
                    </label>
                    <span className={cls.fileName}>
                        {imageName
                            ? `Выбранный файл: ${imageName}`
                            : "Файл не выбран"}
                    </span>
                    <p>Текст новости</p>
                    <div
                        style={{ backgroundColor: "#f0efef" }}
                        id="editorjs"></div>
                    <div className={cls.btnList}>
                        {!isDraft && editorType === "add" && (
                            <button
                                value="post-publish"
                                type="submit"
                                className={cls.formButton}>
                                Опубликовать пост
                            </button>
                        )}
                        {!isDraft && editorType === "add" && (
                            <button
                                value="draft-save"
                                type="submit"
                                className={cls.formButton}>
                                Сохранить в черновик
                            </button>
                        )}

                        {!isDraft && editorType === "edit" && (
                            <button
                                value="post-update"
                                type="submit"
                                className={cls.formButton}>
                                Обновить пост
                            </button>
                        )}
                        {isDraft && editorType === "edit" && (
                            <button
                                value="draft-update"
                                type="submit"
                                className={cls.formButton}>
                                Обновить черновик
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}
