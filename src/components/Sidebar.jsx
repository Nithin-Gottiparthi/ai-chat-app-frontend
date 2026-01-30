import { Plus, MessageCircle, Trash2, Pencil, X } from "lucide-react";
import GlassCard from "./GlassCard";
import { useState } from "react";

export default function Sidebar({
    chats = [],
    activeChatId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    onRenameChat,
    onCloseMobile,
    mobile = false,
    loading = false
}) {
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState("");

    const startEdit = (chat) => {
        setEditingId(chat._id);
        setTitle(chat.title);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setTitle("");
    };

    const saveEdit = () => {
        if (!editingId) return;
        onRenameChat(editingId, title);
        cancelEdit();
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 p-3">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold">Groq Chat</p>
                        <p className="text-xs text-white/60">Your conversations</p>
                    </div>
                </div>

                {mobile && (
                    <button
                        onClick={onCloseMobile}
                        className="p-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* New Chat */}
            <div className="px-3">
                <button
                    onClick={onNewChat}
                    className="w-full rounded-2xl px-3 py-3 flex items-center justify-center gap-2
                     bg-white/15 border border-white/20 hover:bg-white/20 transition shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">New Chat</span>
                </button>
            </div>

            {/* Chats */}
            <div className="mt-4 px-2 flex-1 overflow-y-auto space-y-1">
                {loading ? (
                    <div className="space-y-2 px-2">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-14 rounded-2xl bg-white/10 border border-white/10 animate-pulse"
                            />
                        ))}
                    </div>
                ) : chats.length === 0 ? (
                    <div className="text-white/50 text-sm text-center mt-10">
                        No chats yet.
                    </div>
                ) : (
                    chats.map((c) => {
                        const active = c._id === activeChatId;
                        const editing = editingId === c._id;

                        return (
                            <div
                                key={c._id}
                                className={`w-full rounded-2xl border transition px-3 py-3 ${active
                                        ? "bg-white/20 border-white/25"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onSelectChat(c._id)}
                                        className="flex-1 flex items-center gap-3 min-w-0"
                                    >
                                        <div
                                            className={`h-9 w-9 rounded-2xl flex items-center justify-center border
                        ${active
                                                    ? "bg-white/15 border-white/25"
                                                    : "bg-black/20 border-white/10"
                                                }`}
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                        </div>

                                        <div className="min-w-0 text-left">
                                            {editing ? (
                                                <input
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                                    className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/20 outline-none text-sm"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium truncate">{c.title}</p>
                                            )}

                                            <p className="text-xs text-white/50 truncate">
                                                {new Date(c.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {editing ? (
                                            <>
                                                <button
                                                    onClick={saveEdit}
                                                    className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15"
                                                    title="Save"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15"
                                                    title="Cancel"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(c)}
                                                    className="p-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15"
                                                    title="Rename"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteChat(c._id)}
                                                    className="p-2 rounded-xl bg-white/10 border border-white/15 hover:bg-red-500/30 hover:border-red-500/30 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="p-3">
                <GlassCard className="p-3">
                    <p className="text-xs text-white/60">
                        Delete • Rename • Skeleton loading
                    </p>
                </GlassCard>
            </div>
        </div>
    );
}
