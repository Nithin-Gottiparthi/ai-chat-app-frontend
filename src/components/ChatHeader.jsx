import { Sparkles } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-lg">
        <Sparkles className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-lg font-semibold tracking-wide">Groq AI Chat</h1>
        <p className="text-xs text-white/60">Liquid Glass MERN Chat</p>
      </div>
    </div>
  );
}
