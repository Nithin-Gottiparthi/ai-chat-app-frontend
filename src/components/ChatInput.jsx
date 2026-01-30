import { useState } from "react";
import { SendHorizonal } from "lucide-react";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim() || loading) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ask anything..."
        className="flex-1 rounded-2xl px-4 py-3 bg-white/10 border border-white/15 outline-none focus:ring-2 focus:ring-white/20"
      />
      <button
        onClick={submit}
        disabled={loading}
        className="h-12 w-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/20 transition disabled:opacity-50"
      >
        <SendHorizonal className="w-5 h-5" />
      </button>
    </div>
  );
}
