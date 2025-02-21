import { useFormStatus } from "react-dom";

export const SubmitButton = ({ className }: { className: string }) => {
    const status = useFormStatus();

    return (
        <button disabled={status.pending} type="submit" className={className}>
            {status.pending ? "loading..." : "Login"}
        </button>
    );
};
