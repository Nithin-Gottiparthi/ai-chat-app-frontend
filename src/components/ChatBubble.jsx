export default function ChatBubble({ role, content }) {
  const isUser = role === "user";
  const isSkeleton = role === "assistant" && content === "__LOADING__";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] px-4 py-3 rounded-3xl border shadow-lg
        ${
          isUser
            ? "bg-white/15 border-white/20 backdrop-blur-xl"
            : "bg-black/25 border-white/10 backdrop-blur-xl"
        }`}
      >
        {isSkeleton ? (
          <div className="space-y-2 w-[220px]">
            <div className="h-3 w-3/4 rounded-full bg-white/10 animate-pulse" />
            <div className="h-3 w-full rounded-full bg-white/10 animate-pulse" />
            <div className="h-3 w-2/3 rounded-full bg-white/10 animate-pulse" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}
