// import { useRef, useEffect, useState } from "react";
// import EditorJS, { OutputData } from "@editorjs/editorjs";
// import List from "@editorjs/list";
// import Code from "@editorjs/code";
// import Raw from "@editorjs/raw";
// import Header from "@editorjs/header";
// import Quote from "@editorjs/quote";
// import Marker from "@editorjs/marker";
// import Delimiter from "@editorjs/delimiter";
// import styles from "./NewsForm.module.scss";

// export function NewsForm({ initialData, slug }) {
//     const [data, setData] = useState(initialData?.content || {});
//     const [editor, setEditor] = useState(null);
//     const [authors, setAuthors] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedAuthor, setSelectedAuthor] = useState(
//         initialData?.authorDetails?.name || ""
//     );
//     const [selectedCategory, setSelectedCategory] = useState(
//         initialData?.categoryDetails?.name || ""
//     );
//     const [image, setImage] = useState(initialData?.image || null);
//     const [title, setTitle] = useState(initialData?.title || "");
//     const [subtitle, setSubtitle] = useState(initialData?.subTitle || "");
//     const imageRef = useRef(null);

//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/authors`)
//             .then((response) => response.json())
//             .then((data) =>
//                 setAuthors(
//                     data.map((author) => ({
//                         id: author._id,
//                         name: author.name,
//                     }))
//                 )
//             )
//             .catch((error) =>
//                 console.error("Ошибка при загрузке авторов:", error)
//             );

//         fetch(`${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/categories`)
//             .then((response) => response.json())
//             .then((data) =>
//                 setCategories(
//                     data.map((cat) => ({ id: cat._id, name: cat.name }))
//                 )
//             )
//             .catch((error) =>
//                 console.error("Ошибка при загрузке категорий:", error)
//             );
//     }, []);

//     useEffect(() => {
//         const editorInstance = new EditorJS({
//             holder: "editorjs",
//             autofocus: true,
//             data,
//             tools: {
//                 header: Header,
//                 list: List,
//                 code: Code,
//                 raw: Raw,
//                 quote: Quote,
//                 marker: Marker,
//                 delimiter: Delimiter,
//             },
//         });
//         setEditor(editorInstance);
//     }, []);

//     const handleSave = (event) => {
//         event.preventDefault();
//         editor?.save().then((outputData) => {
//             setData(outputData);
//             const postData = {
//                 author: selectedAuthor,
//                 category: selectedCategory,
//                 title,
//                 subtitle,
//                 content: JSON.stringify(outputData),
//                 image,
//             };

//             fetch(
//                 `${import.meta.env.VITE_PUBLIC_API_PATH}/api/db/posts/${slug}`,
//                 {
//                     method: initialData ? "PUT" : "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(postData),
//                 }
//             )
//                 .then((response) => response.json())
//                 .then((result) =>
//                     console.log("Post successfully saved:", result)
//                 )
//                 .catch((error) => console.error("Error posting data:", error));
//         });
//     };

//     return (
//         <div className={styles.formContainer}>
//             <form onSubmit={handleSave}>
//                 <p>Автор</p>
//                 <select
//                     value={selectedAuthor}
//                     onChange={(e) => setSelectedAuthor(e.target.value)}
//                     className={styles.formSelect}
//                     required>
//                     <option disabled hidden value="">
//                         Выберите автора
//                     </option>
//                     {authors.map((author) => (
//                         <option key={author.id} value={author.id}>
//                             {author.name}
//                         </option>
//                     ))}
//                 </select>

//                 <p>Категория</p>
//                 <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className={styles.formSelect}
//                     required>
//                     <option disabled hidden value="">
//                         Выберите категорию
//                     </option>
//                     {categories.map((category) => (
//                         <option key={category.id} value={category.id}>
//                             {category.name}
//                         </option>
//                     ))}
//                 </select>

//                 <p>Заголовок</p>
//                 <input
//                     type="text"
//                     className={styles.formInput}
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                 />

//                 <p>Подзаголовок</p>
//                 <input
//                     type="text"
//                     className={styles.formInput}
//                     value={subtitle}
//                     onChange={(e) => setSubtitle(e.target.value)}
//                     required
//                 />

//                 <p>Картинка</p>
//                 <input
//                     ref={imageRef}
//                     type="file"
//                     className={styles.formInput}
//                     onChange={(e) => setImage(e.target.files?.[0] || null)}
//                     accept="image/*"
//                     style={{ display: "none" }}
//                 />
//                 <label
//                     htmlFor="fileInput"
//                     className={styles.uploadButton}
//                     onClick={() => imageRef.current?.click()}>
//                     Выбрать файл
//                 </label>
//                 <span className={styles.fileName}>
//                     {image
//                         ? `Выбранный файл: ${image.name || image}`
//                         : "Файл не выбран"}
//                 </span>

//                 <p>Текст</p>
//                 <div id="editorjs" style={{ backgroundColor: "#f0efef" }}></div>

//                 <button type="submit" className={styles.formButton}>
//                     СОХРАНИТЬ
//                 </button>
//             </form>
//         </div>
//     );
// }
