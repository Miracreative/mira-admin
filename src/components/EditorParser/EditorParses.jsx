import edjsHTML from "editorjs-html";
import parse from "html-react-parser";
const edjsParser = edjsHTML();

export default function EditorParser({ data }) {
    const html = edjsParser.parse(data);
    return <div className="text-container">{parse(html.join(""))}</div>;
}
