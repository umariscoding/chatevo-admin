"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  Mail,
  Headphones,
  Sparkles,
  Zap,
  HelpCircle,
  Bot,
  Wand2,
  Phone,
  MessagesSquare,
  X,
} from "lucide-react";
import type { EmbedSettings, ButtonIconType } from "@/types/settings";
import { API_CONFIG } from "@/constants/api";

const BUTTON_ICON_MAP: Record<ButtonIconType, React.ElementType> = {
  chat: MessageCircle,
  message: Mail,
  headset: Headphones,
  sparkle: Sparkles,
  bolt: Zap,
  help: HelpCircle,
  robot: Bot,
  wand: Wand2,
  phone: Phone,
  bubble: MessagesSquare,
};

interface WidgetPreviewProps {
  settings: EmbedSettings;
  chatbotTitle?: string;
  companyName?: string;
  companySlug?: string;
}

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function WidgetPreview({
  settings,
  chatbotTitle,
  companyName,
  companySlug,
}: WidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    theme,
    position,
    primaryColor,
    headerColor,
    welcomeText,
    subtitleText,
    placeholderText,
    showHeaderSubtitle,
    hideBranding,
    buttonIcon,
    chatTemplate,
    suggestedMessages,
  } = settings;

  const resolvedHeaderColor = headerColor || primaryColor;

  const colors =
    theme === "light"
      ? {
          bg: "#ffffff",
          bgInput: "#f4f4f5",
          text: "#18181b",
          textSecondary: "#3f3f46",
          textMuted: "#71717a",
          border: "#e4e4e7",
        }
      : {
          bg: "#09090b",
          bgInput: "#27272a",
          text: "#e4e4e7",
          textSecondary: "#a1a1aa",
          textMuted: "#71717a",
          border: "#27272a",
        };

  // Invert background to contrast with widget theme
  const previewBg =
    theme === "light"
      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
      : "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)";

  const placeholderBg =
    theme === "light" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
  const lineBg =
    theme === "light" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)";

  const title = chatbotTitle || companyName || "Chat Assistant";

  // Scroll to bottom only when a new message is added (not on streaming content updates)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = useCallback(async (directMessage?: string) => {
    const msg = (directMessage || inputValue).trim();
    if (!msg || isLoading || !companySlug) return;

    setInputValue("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/public/chatbot/${companySlug}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, chat_id: chatId }),
        }
      );

      if (!response.ok) throw new Error("Failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let fullResponse = "";
      let botMsgAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "start") {
                setChatId(data.chat_id);
              } else if (data.type === "chunk" && data.content) {
                fullResponse += data.content;

                const currentResponse = fullResponse;
                if (!botMsgAdded) {
                  botMsgAdded = true;
                  setMessages((prev) => [
                    ...prev,
                    { role: "bot", content: currentResponse },
                  ]);
                } else {
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "bot",
                      content: currentResponse,
                    };
                    return updated;
                  });
                }
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, companySlug, chatId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const BotAvatar = () => null;

  const ButtonIconSvg = () => {
    const IconComp = BUTTON_ICON_MAP[buttonIcon] || MessageCircle;
    return <IconComp size={24} color="white" strokeWidth={2} />;
  };

  // Lightweight markdown → HTML (matches embed.js renderMarkdown exactly)
  const renderMarkdown = useCallback((text: string): string => {
    // Escape HTML
    const div = document.createElement("div");
    div.textContent = text;
    let html = div.innerHTML;

    // Code blocks
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_m: string, _l: string, code: string) =>
      `<pre style="background:${colors.bgInput};padding:10px 12px;border-radius:8px;overflow-x:auto;margin:6px 0;font-size:13px;line-height:1.5;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-word"><code>${code.trim()}</code></pre>`
    );
    // Inline code
    html = html.replace(/`([^`]+)`/g, `<code style="background:${colors.bgInput};padding:1px 5px;border-radius:4px;font-size:13px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace">$1</code>`);
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight:600;color:${colors.text}">$1</strong>`);
    // Italic
    html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
    // Headings → bold
    html = html.replace(/^#{1,6}\s+(.+)$/gm, `<strong style="font-weight:600;color:${colors.text}">$1</strong>`);
    // Unordered lists
    html = html.replace(/^[*-]\s+(.+)$/gm, '<li style="margin-bottom:2px;line-height:1.5">$1</li>');
    html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul style="margin:4px 0;padding:0 0 0 20px;list-style:disc">$1</ul>');
    // Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li style="margin-bottom:2px;line-height:1.5">$1</li>');
    html = html.replace(/(?<!<\/ul>)\s*((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ol style="margin:4px 0;padding:0 0 0 20px;list-style:decimal">$1</ol>');
    // Line breaks
    html = html.replace(/\n/g, "<br>");
    html = html.replace(/<br>\s*(<\/?(?:ul|ol|li|pre))/g, "$1");
    html = html.replace(/(<\/(?:ul|ol|pre)>)\s*<br>/g, "$1");
    return html;
  }, [colors]);

  const BotMarkdown = ({ content }: { content: string }) => (
    <span dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
  );

  const showWelcome = messages.length === 0;

  // Template-specific styles
  const getModalStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 420,
      maxWidth: "calc(100% - 40px)",
      height: 600,
      maxHeight: "calc(100% - 100px)",
      background: colors.bg,
      boxShadow: `0 20px 50px rgba(0,0,0,${theme === "light" ? 0.15 : 0.5})`,
      bottom: 88,
      [position === "left" ? "left" : "right"]: 20,
      zIndex: 20,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? "visible" : "hidden",
      transform: isOpen ? "translateY(0)" : "translateY(10px)",
    };

    if (chatTemplate === "bubbles") {
      return { ...base, borderRadius: 24 };
    }
    if (chatTemplate === "minimal") {
      return { ...base, borderRadius: 8, border: `1px solid ${colors.border}`, boxShadow: `0 8px 30px rgba(0,0,0,${theme === "light" ? 0.1 : 0.4})` };
    }
    return { ...base, borderRadius: 16 };
  };

  const getHeaderStyles = (): React.CSSProperties => {
    if (chatTemplate === "bubbles") {
      return {
        padding: "20px 16px",
        background: resolvedHeaderColor,
      };
    }
    if (chatTemplate === "minimal") {
      return {
        padding: "14px 16px",
        background: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
      };
    }
    return {
      padding: 16,
      background: resolvedHeaderColor,
    };
  };

  const getInputWrapperStyles = (): React.CSSProperties => {
    if (chatTemplate === "bubbles") {
      return {
        background: colors.bgInput,
        borderRadius: 28,
        padding: "8px 8px 8px 18px",
      };
    }
    if (chatTemplate === "minimal") {
      return {
        background: "transparent",
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: "8px 8px 8px 12px",
      };
    }
    return {
      background: colors.bgInput,
      borderRadius: 24,
      padding: "8px 8px 8px 16px",
    };
  };

  const renderHeader = () => {
    if (chatTemplate === "minimal") {
      return (
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={getHeaderStyles()}
        >
          <div className="flex items-center gap-2.5">
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                {title}
              </div>
              {showHeaderSubtitle && subtitleText && (
                <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
                  {subtitleText}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center transition-colors"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: colors.textMuted,
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      );
    }

    if (chatTemplate === "bubbles") {
      return (
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={getHeaderStyles()}
        >
          <div className="flex items-center gap-3">
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}>
                {title}
              </div>
              {showHeaderSubtitle && subtitleText && (
                <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)", marginTop: 2 }}>
                  {subtitleText}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center transition-colors"
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              cursor: "pointer",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      );
    }

    // Default header
    return (
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={getHeaderStyles()}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#ffffff" }}>
            {title}
          </div>
          {showHeaderSubtitle && subtitleText && (
            <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)", marginTop: 2 }}>
              {subtitleText}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-center transition-colors"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    );
  };

  const renderMessage = (msg: ChatMessage, i: number) => {
    const isUser = msg.role === "user";
    const streamCursor = isLoading && !isUser && i === messages.length - 1 && (
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: 14,
          background: colors.textMuted,
          marginLeft: 2,
          verticalAlign: "text-bottom",
          animation: "botbeetle-preview-blink 0.8s infinite",
        }}
      />
    );

    if (chatTemplate === "bubbles") {
      return isUser ? (
        <div key={i} style={{ alignSelf: "flex-end", maxWidth: "80%", marginBottom: 10 }}>
          <div
            style={{
              background: primaryColor,
              color: "#ffffff",
              borderRadius: "20px 20px 4px 20px",
              padding: "10px 16px",
              fontSize: 14,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {msg.content}
          </div>
        </div>
      ) : (
        <div key={i} className="flex items-end gap-2" style={{ maxWidth: "80%", marginBottom: 10 }}>
          <BotAvatar />
          <div
            style={{
              background: colors.bgInput,
              color: colors.text,
              borderRadius: "20px 20px 20px 4px",
              padding: "10px 16px",
              fontSize: 14,
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            <BotMarkdown content={msg.content} />
            {streamCursor}
          </div>
        </div>
      );
    }

    if (chatTemplate === "minimal") {
      return isUser ? (
        <div key={i} style={{ alignSelf: "flex-end", maxWidth: "85%", marginBottom: 6 }}>
          <div
            style={{
              background: theme === "light" ? "#f0f0f0" : "#1a1a1e",
              color: colors.text,
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 13,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {msg.content}
          </div>
        </div>
      ) : (
        <div key={i} className="flex items-start gap-2" style={{ maxWidth: "85%", marginBottom: 6 }}>
          <BotAvatar />
          <div
            style={{
              color: colors.textSecondary,
              padding: "6px 0",
              fontSize: 13,
              lineHeight: 1.6,
              wordBreak: "break-word",
            }}
          >
            <BotMarkdown content={msg.content} />
            {streamCursor}
          </div>
        </div>
      );
    }

    // Default template
    return isUser ? (
      <div key={i} style={{ alignSelf: "flex-end", maxWidth: "85%", marginBottom: 8 }}>
        <div
          style={{
            background: colors.bgInput,
            color: colors.text,
            borderRadius: 18,
            padding: "10px 14px",
            fontSize: 14,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {msg.content}
        </div>
      </div>
    ) : (
      <div key={i} className="flex items-start gap-2" style={{ maxWidth: "85%", marginBottom: 8 }}>
        <BotAvatar />
        <div
          style={{
            fontSize: 14,
            color: colors.textSecondary,
            padding: "4px 0",
            lineHeight: 1.6,
            wordBreak: "break-word",
          }}
        >
          <BotMarkdown content={msg.content} />
          {streamCursor}
        </div>
      </div>
    );
  };

  const isBubbles = chatTemplate === "bubbles";
  const isMinimal = chatTemplate === "minimal";
  const filteredSuggestions = (suggestedMessages ?? []).filter((s) => s.trim().length > 0);
  const suggestionBorder = theme === "light" ? "#d4d4d8" : "#3f3f46";

  const renderSuggestions = () => {
    if (filteredSuggestions.length === 0) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start", padding: "12px 0" }}>
        {filteredSuggestions.map((msg, i) => (
          <button
            key={i}
            onClick={() => sendMessage(msg)}
            style={{
              padding: "8px 14px",
              fontSize: 13,
              borderRadius: 10,
              border: `1.5px solid ${suggestionBorder}`,
              background: "transparent",
              color: colors.text,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
              fontFamily: "inherit",
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.color = primaryColor; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = suggestionBorder; e.currentTarget.style.color = colors.text; }}
          >
            {msg}
          </button>
        ))}
      </div>
    );
  };

  const renderWelcome = () => {
    const hasSuggestions = filteredSuggestions.length > 0;
    const centerStyle: React.CSSProperties = !hasSuggestions
      ? { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }
      : {};

    return (
      <div className="flex-1 flex flex-col" style={{ padding: isBubbles ? 24 : 20 }}>
        <div style={centerStyle}>
          {welcomeText && (
            <div style={{ fontSize: isMinimal ? 14 : 15, fontWeight: isBubbles ? 500 : 400, color: isBubbles ? colors.text : colors.textSecondary, marginBottom: 4 }}>
              {welcomeText}
            </div>
          )}
          {subtitleText && (
            <div style={{ fontSize: isMinimal ? 12 : 13, color: colors.textMuted, marginBottom: 4 }}>{subtitleText}</div>
          )}
        </div>
        {renderSuggestions()}
      </div>
    );
  };

  // isBubbles / isMinimal moved above renderWelcome

  const renderSendButton = () => {
    const disabled = !inputValue.trim() || isLoading;

    if (chatTemplate === "bubbles") {
      return (
        <button
          onClick={() => sendMessage()}
          disabled={disabled}
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            background: disabled ? colors.bgInput : primaryColor,
            color: disabled ? colors.textMuted : "#ffffff",
            transition: "all 0.15s",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      );
    }

    if (chatTemplate === "minimal") {
      return (
        <button
          onClick={() => sendMessage()}
          disabled={disabled}
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            background: disabled ? "transparent" : primaryColor,
            color: disabled ? colors.textMuted : "#ffffff",
            opacity: disabled ? 0.4 : 1,
            transition: "all 0.15s",
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      );
    }

    // Default
    return (
      <button
        onClick={() => sendMessage()}
        disabled={disabled}
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          background: "transparent",
          color: colors.textMuted,
          opacity: disabled ? 0.3 : 1,
          transition: "all 0.15s",
        }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{
        height: 720,
        background: previewBg,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Fake page content placeholders */}
      <div className="p-5">
        <div
          style={{
            background: placeholderBg,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <div style={{ height: 8, background: lineBg, borderRadius: 4, width: "60%", marginBottom: 8 }} />
          <div style={{ height: 8, background: lineBg, borderRadius: 4, width: "80%" }} />
        </div>
        <div style={{ background: placeholderBg, borderRadius: 12, padding: 16 }}>
          <div style={{ height: 8, background: lineBg, borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 8, background: lineBg, borderRadius: 4, width: "80%", marginBottom: 8 }} />
          <div style={{ height: 8, background: lineBg, borderRadius: 4, width: "60%" }} />
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute flex items-center justify-center transition-transform hover:scale-105"
        style={{
          width: 56,
          height: 56,
          borderRadius: chatTemplate === "minimal" ? 12 : "50%",
          background: primaryColor,
          border: "none",
          cursor: "pointer",
          boxShadow: `0 4px 20px rgba(0,0,0,${theme === "light" ? 0.15 : 0.4})`,
          bottom: 20,
          [position === "left" ? "left" : "right"]: 20,
          zIndex: 10,
        }}
      >
        {/* Chat icon — animates out when open */}
        <span
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? "scale(0) rotate(90deg)" : "scale(1) rotate(0deg)",
            transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ButtonIconSvg />
        </span>
        {/* Close icon — animates in when open */}
        <span
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
            transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <X size={24} color="white" strokeWidth={2} />
        </span>
      </button>

      {/* Chat Modal */}
      <div
        className="absolute flex flex-col overflow-hidden transition-all duration-200"
        style={getModalStyles()}
      >
        {/* Header */}
        {renderHeader()}

        {/* Messages area */}
        <div
          className="flex-1 flex flex-col overflow-y-auto"
          style={{ padding: chatTemplate === "minimal" ? "12px 14px" : "8px 16px" }}
        >
          {showWelcome ? renderWelcome() : (
            <>
              {messages.map((msg, i) => renderMessage(msg, i))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-start gap-2" style={{ marginBottom: 8 }}>
                  <BotAvatar />
                  <div className="flex gap-1" style={{ padding: "8px 0" }}>
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        style={{
                          width: 6,
                          height: 6,
                          background: colors.textMuted,
                          borderRadius: "50%",
                          animation: `botbeetle-preview-bounce 1.4s infinite ease-in-out`,
                          animationDelay: `${-0.32 + d * 0.16}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {!messages.some((m) => m.role === "user") && renderSuggestions()}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div style={{ padding: chatTemplate === "minimal" ? "12px 14px" : 16, flexShrink: 0 }}>
          <div className="flex items-center" style={getInputWrapperStyles()}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText}
              rows={1}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: colors.text,
                fontSize: chatTemplate === "minimal" ? 13 : 14,
                resize: "none",
                outline: "none",
                maxHeight: 80,
                minHeight: 20,
                lineHeight: "20px",
                padding: 0,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            />
            {renderSendButton()}
          </div>
        </div>

        {/* Powered by */}
        {!hideBranding && (
          <div
            className="text-center"
            style={{
              padding: 8,
              fontSize: 10,
              color: colors.textMuted,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            Powered by BotBeetle
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes botbeetle-preview-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes botbeetle-preview-bounce {
          0%, 80%, 100% { opacity: 0.4; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
