import TerminalCursor from "@/components/layout/terminal-cursor";

export default function LoadingIndicator() {
    return (
        <div className="hz-and-vert-center">
            <TerminalCursor size={80} />
        </div>
    );
}
