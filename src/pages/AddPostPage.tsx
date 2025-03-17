import { Header } from "../components/Header/Header";
import { EDITOR } from "../components/Editor/Editor";

export function AddPostPage() {
    return (
        <>
            <Header />
            <EDITOR isDraft={false} editorType="add" />
        </>
    );
}
