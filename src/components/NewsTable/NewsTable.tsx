import cls from "./style.module.scss";
import editIMG from "../../assets/edit-button.svg";
import { Post } from "../News/News";
import { Link } from "react-router";

type NewsTableProps = {
    news: Post[];
    isDraft?: boolean;
    handleDeleteNews: (title: string, slug: string) => void;
    handlePublishNews?: (title: string, slug: string) => void;
    handleAddToDraftNews?: (title: string, slug: string) => void;
};

export const NewsTable = ({
    news,
    isDraft = false,
    handleDeleteNews,
    handlePublishNews,
    handleAddToDraftNews,
}: NewsTableProps) => {
    return (
        <div className={cls.tableContainer}>
            <table className={cls.newsTable}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Заголовок</th>
                        <th>Подзаголовок</th>
                        <th>Автор</th>
                        {!isDraft && <th>Добавить в черновик</th>}
                        {isDraft && <th>Опубликовать</th>}
                        <th>Редактировать</th>
                        <th className={cls.remove}>Удалить</th>
                    </tr>
                </thead>
                <tbody>
                    {news &&
                        news.map((newsItem, index) => (
                            <tr key={newsItem._id ?? index}>
                                <td>{index + 1}</td>
                                <td>{newsItem.title}</td>
                                <td>{newsItem.subTitle}</td>
                                <td>{newsItem.authorDetails?.name}</td>

                                {!isDraft && (
                                    <td>
                                        <svg
                                            fill="#000000"
                                            version="1.1"
                                            id="Capa_1"
                                            onClick={() => {
                                                if (handleAddToDraftNews) {
                                                    handleAddToDraftNews(
                                                        newsItem.title,
                                                        newsItem.slug
                                                    );
                                                }
                                            }}
                                            className={cls.icon}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 45.402 45.402">
                                            <g
                                                id="SVGRepo_bgCarrier"
                                                strokeWidth="0"></g>
                                            <g
                                                id="SVGRepo_tracerCarrier"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                {" "}
                                                <g>
                                                    {" "}
                                                    <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path>{" "}
                                                </g>{" "}
                                            </g>
                                        </svg>
                                    </td>
                                )}
                                {isDraft && (
                                    <td>
                                        <svg
                                            onClick={() => {
                                                if (handlePublishNews) {
                                                    handlePublishNews(
                                                        newsItem.title,
                                                        newsItem.slug
                                                    );
                                                }
                                            }}
                                            className={cls.icon}
                                            xmlns="http://www.w3.org/2000/svg"
                                            version="1.0"
                                            width="1280.000000pt"
                                            height="1253.000000pt"
                                            viewBox="0 0 1280.000000 1253.000000"
                                            preserveAspectRatio="xMidYMid meet">
                                            <g
                                                transform="translate(0.000000,1253.000000) scale(0.100000,-0.100000)"
                                                fill="#000000"
                                                stroke="none">
                                                <path d="M12000 12520 c-192 -27 -395 -98 -655 -230 -446 -225 -961 -590 -1620 -1149 -926 -785 -2158 -2000 -3466 -3416 -661 -717 -1389 -1537 -1913 -2157 -87 -104 -159 -188 -160 -188 -1 0 -67 34 -146 76 -255 134 -875 442 -1078 536 -849 391 -1441 595 -1912 659 -134 18 -368 13 -479 -10 -224 -48 -405 -181 -495 -366 -52 -104 -69 -183 -70 -310 -1 -105 1 -113 32 -177 29 -59 55 -87 235 -254 438 -407 919 -904 1273 -1315 792 -921 1625 -2167 2579 -3858 168 -297 234 -355 405 -355 66 0 96 5 132 21 113 51 158 111 238 313 135 341 398 964 565 1335 1285 2866 2820 5295 4654 7365 520 587 971 1049 1821 1866 665 640 790 788 844 1005 81 328 -187 601 -604 614 -63 2 -144 0 -180 -5z" />
                                            </g>
                                        </svg>
                                    </td>
                                )}
                                <td>
                                    <Link
                                        to={`/news/${
                                            newsItem.slug
                                        }/edit?isdraft=${
                                            isDraft ? "true" : "false"
                                        }`}>
                                        <img
                                            className={cls.icon}
                                            src={editIMG}
                                            width={40}
                                            height={40}
                                            alt="edit"
                                        />
                                    </Link>
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
            {news.length === 0 && (
                <h1 style={{ textAlign: "center" }}>
                    {isDraft ? "Черновиков нет" : "Новостей нет"}
                </h1>
            )}
        </div>
    );
};
