// import { useRef } from "react";
// import EditorJS, { OutputData } from "@editorjs/editorjs";
// import List from "@editorjs/list";
// import Code from "@editorjs/code";
// import Raw from "@editorjs/raw";
// import Header from "@editorjs/header";
// import Quote from "@editorjs/quote";
// import Marker from "@editorjs/marker";
// import Delimiter from "@editorjs/delimiter";
// import { useEffect, useState } from "react";
// import styles from "./AddPostForm.module.scss"; // Импортируем стили

// type Authors = {
//     id: string;
//     name: string;
// };

// type Categories = {
//     id: string;
//     name: string;
// };

// export function AddPostForm() {
//     const [data, setData] = useState<OutputData>();
//     const [editor, setEditor] = useState();

//     const [authors, setAuthors] = useState<Authors[]>([]);
//     const [categories, setCategories] = useState<Categories[]>([]);
//     const [selectedAuthor, setSelectedAuthor] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [image, setImage] = useState<File | null>(null);
//     const [title, setTitle] = useState("");
//     const [subtitle, setSubtitle] = useState("");

//     const imageRef = useRef(null);

//     // Запросы к серверу для получения данных авторов и категорий
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/authors`)
//             .then((response) => response.json())
//             .then((data) => {
//                 const authorsName = data.map(
//                     (author: { name: string; _id: string }) => ({
//                         id: author._id,
//                         name: author.name,
//                     })
//                 );
//                 setAuthors(authorsName);
//             })
//             .catch((error) => {
//                 console.error("Ошибка при загрузке авторов:", error);
//             });

//         fetch(`${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/categories`)
//             .then((response) => response.json())
//             .then((data) => {
//                 const categories = data.map(
//                     (cat: { name: string; _id: string }) => ({
//                         name: cat.name,
//                         id: cat._id,
//                     })
//                 );
//                 setCategories(categories);
//             })
//             .catch((error) => {
//                 console.error("Ошибка при загрузке категорий:", error);
//             });
//     }, []);

//     useEffect(() => {
//         const editor = new EditorJS({
//             autofocus: true,
//             holder: "editorjs",
//             tools: {
//                 header: Header,
//                 list: List,
//                 code: Code,
//                 raw: Raw,
//                 quote: Quote,
//                 marker: Marker,
//                 delimiter: Delimiter,
//             },
//             i18n: {
//                 messages: {
//                     toolNames: {
//                         Text: "Параграф",
//                         Heading: "Заголовок",
//                         List: "Список",
//                         Warning: "Примечание",
//                         Checklist: "Чеклист",
//                         Quote: "Цитата",
//                         Code: "Код",
//                         Delimiter: "Разделитель",
//                         "Raw HTML": "HTML-фрагмент",
//                         Table: "Таблица",
//                         Link: "Ссылка",
//                         Marker: "Маркер",
//                         Bold: "Полужирный",
//                         Italic: "Курсив",
//                         InlineCode: "Моноширинный",
//                     },
//                 },
//             },
//         });
//         setEditor(editor);
//     }, []);

//     const handleClick = () => {
//         // Преобразуем изображение в Base64
//         const reader = new FileReader();

//         reader.onloadend = () => {
//             const base64Image = reader.result.split(",")[1]; // Извлекаем строку Base64
//             const extension = reader.result
//                 .split(",")[0]
//                 .split(";")[0]
//                 .split("/")[1];

//             editor
//                 .save()
//                 .then((outputData) => {
//                     setData(outputData);

//                     // Создаем объект с данными для отправки
//                     const postData = {
//                         author: selectedAuthor,
//                         category: selectedCategory,
//                         title: title,
//                         subtitle: subtitle,
//                         content: JSON.stringify(outputData),
//                         image: {
//                             base64: base64Image,
//                             extension: extension,
//                         }, // Передаем изображение в формате Base64
//                     };

//                     console.log("postData", postData);

//                     // Отправка данных в формате JSON
//                     fetch(
//                         `${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/posts`,
//                         {
//                             method: "POST",
//                             headers: {
//                                 "Content-Type": "application/json", // Устанавливаем заголовок для JSON
//                             },
//                             body: JSON.stringify(postData), // Отправляем данные в JSON формате
//                         }
//                     )
//                         .then((response) => response.json())
//                         .then((result) => {
//                             console.log("Post successfully created:", result);
//                         })
//                         .catch((error) => {
//                             console.error("Error posting data:", error);
//                         });
//                 })
//                 .catch((error) => {
//                     console.log("Saving failed: ", error);
//                 });
//         };

//         reader.readAsDataURL(image); // Преобразуем файл изображения в Base64
//     };

//     return (
//         <>
//             <div className={styles.formContainer}>
//                 <form action={handleClick}>
//                     <p>Автор</p>
//                     <select
//                         value={selectedAuthor}
//                         onChange={(e) => setSelectedAuthor(e.target.value)}
//                         className={styles.formSelect}
//                         required>
//                         <option disabled hidden value="">
//                             Выберите автора
//                         </option>
//                         {authors.map((author) => (
//                             <option key={author.id} value={author.id}>
//                                 {author.name}
//                             </option>
//                         ))}
//                     </select>

//                     <p>Категория</p>
//                     <select
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className={styles.formSelect}
//                         required>
//                         <option disabled hidden value="">
//                             Выберите категорию
//                         </option>
//                         {categories.map((category) => (
//                             <option key={category.id} value={category.id}>
//                                 {category.name}
//                             </option>
//                         ))}
//                     </select>

//                     <p>Заголовок новости</p>
//                     <input
//                         type="text"
//                         className={styles.formInput}
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                     />

//                     <p>Подзаголовок новости</p>
//                     <input
//                         type="text"
//                         className={styles.formInput}
//                         value={subtitle}
//                         onChange={(e) => setSubtitle(e.target.value)}
//                         required
//                     />

//                     <p>Картинка новости</p>
//                     <input
//                         ref={imageRef}
//                         accept="image/png, image/jpg, image/jpeg, image/webp"
//                         type="file"
//                         className={styles.formInput}
//                         onChange={(e) => {
//                             console.log("change in onchange");
//                             setImage(e.target.files ? e.target.files[0] : null);
//                         }}
//                         required
//                     />

//                     <p>Текст новости</p>
//                     <div
//                         style={{ backgroundColor: "#f0efef" }}
//                         id="editorjs"></div>
//                     <button type="submit" className={styles.formButton}>
//                         СОХРАНИТЬ
//                     </button>
//                 </form>
//             </div>
//         </>
//     );
// }
