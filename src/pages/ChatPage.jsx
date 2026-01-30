import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import GlassCard from "../components/GlassCard";
import ChatHeader from "../components/ChatHeader";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/Sidebar";
import MobileSidebarDrawer from "../components/MobileSidebarDrawer";
import { Menu } from "lucide-react";

export default function ChatPage() {
    const [chats, setChats] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [sidebarLoading, setSidebarLoading] = useState(true);

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const endRef = useRef(null);
    const scrollToBottom = () =>
        endRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => scrollToBottom(), [messages]);

    async function fetchChats() {
        const res = await api.get("/chat");
        setChats(res.data);
    }

    async function createNewChat() {
        const res = await api.post("/chat/new");
        setChatId(res.data._id);
        setMessages([]);
        await fetchChats();
    }

    async function openChat(id) {
        setChatId(id);
        const res = await api.get(`/chat/${id}`);
        setMessages(res.data.messages || []);
        setMobileSidebarOpen(false);
    }

    async function deleteChat(id) {
        await api.delete(`/chat/${id}`);
        await fetchChats();

        if (id === chatId) {
            const updated = await api.get("/chat");
            if (updated.data.length > 0) {
                await openChat(updated.data[0]._id);
            } else {
                await createNewChat();
            }
        }
    }

    async function renameChat(id, title) {
        await api.patch(`/chat/${id}/rename`, { title });
        await fetchChats();
    }

    useEffect(() => {
        (async () => {
            try {
                setSidebarLoading(true);
                const res = await api.get("/chat");
                setChats(res.data);

                if (res.data.length > 0) {
                    await openChat(res.data[0]._id);
                } else {
                    await createNewChat();
                }
            } finally {
                setSidebarLoading(false);
            }
        })();
    }, []);

    const send = async (text) => {
        if (!chatId) return;
        if (loading) return;

        setLoading(true);

        // user message
        setMessages((prev) => [...prev, { role: "user", content: text }]);

        // skeleton assistant
        setMessages((prev) => [...prev, { role: "assistant", content: "__LOADING__" }]);

        try {
            const res = await api.post("/chat/send", {
                chatId,
                message: text
            });

            setMessages(res.data.chat.messages);
            await fetchChats(); // reorder & title update
        } catch (err) {
            setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                    role: "assistant",
                    content: "⚠️ Error: Could not get response from server."
                };
                return copy;
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden">
            <MobileSidebarDrawer open={mobileSidebarOpen}>
                <Sidebar
                    chats={chats}
                    loading={sidebarLoading}
                    activeChatId={chatId}
                    onNewChat={createNewChat}
                    onSelectChat={openChat}
                    onDeleteChat={deleteChat}
                    onRenameChat={renameChat}
                    mobile
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                />
            </MobileSidebarDrawer>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block">
                        <GlassCard className="h-[92vh] p-0 overflow-hidden">
                            <Sidebar
                                chats={chats}
                                loading={sidebarLoading}
                                activeChatId={chatId}
                                onNewChat={createNewChat}
                                onSelectChat={openChat}
                                onDeleteChat={deleteChat}
                                onRenameChat={renameChat}
                            />
                        </GlassCard>
                    </div>

                    {/* Main Chat */}
                    <GlassCard className="h-[92vh] flex flex-col p-4 sm:p-6">
                        <div className="flex lg:hidden items-center justify-between mb-3">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="p-3 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            <button
                                onClick={createNewChat}
                                className="px-4 py-3 rounded-2xl bg-white/15 border border-white/20 hover:bg-white/20 transition text-sm font-medium"
                            >
                                + New Chat
                            </button>
                        </div>

                        <ChatHeader />

                        <div className="mt-4 flex-1 overflow-y-auto no-scrollbar pr-1 sm:pr-2 space-y-3">
                            {messages.length === 0 ? (
                                <div className="text-center mt-10 text-white/60">
                                    <p className="text-xl font-semibold">
                                        Start a conversation ✨
                                    </p>
                                    <p className="text-sm mt-2">
                                        Previous chats shown in sidebar like ChatGPT.
                                    </p>
                                </div>
                            ) : (
                                messages.map((m, idx) => (
                                    <ChatBubble key={idx} role={m.role} content={m.content} />
                                ))
                            )}

                            <div ref={endRef} />
                        </div>

                        <div className="pt-4">
                            <ChatInput loading={loading} onSend={send} />
                            <p className="text-[11px] text-white/45 mt-2 text-center">
                                Non-stream chat • Rename • Delete • Skeleton loading
                            </p>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
