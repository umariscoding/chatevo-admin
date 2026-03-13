"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { EmbedSettings } from "@/types/settings";
import { API_CONFIG } from "@/constants/api";

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
  const [hasShownInitial, setHasShownInitial] = useState(false);
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
    initialMessage,
    hideBranding,
    buttonIcon,
    botDisplayName,
    chatTemplate,
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
  const avatarInitial = botDisplayName
    ? botDisplayName.charAt(0).toUpperCase()
    : "";

  // Show initial message on first open
  useEffect(() => {
    if (isOpen && !hasShownInitial && initialMessage) {
      setHasShownInitial(true);
      setMessages([{ role: "bot", content: initialMessage }]);
    }
  }, [isOpen, hasShownInitial, initialMessage]);

  // Update initial message in real-time when it changes
  useEffect(() => {
    if (!initialMessage) {
      setHasShownInitial(false);
      // If there's only the initial bot message, clear it
      if (messages.length === 1 && messages[0]?.role === "bot") {
        setMessages([]);
      }
    } else if (hasShownInitial && messages.length === 1 && messages[0]?.role === "bot") {
      // Update existing initial message in real-time
      setMessages([{ role: "bot", content: initialMessage }]);
    }
  }, [initialMessage]);

  // Scroll to bottom only when a new message is added (not on streaming content updates)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = useCallback(async () => {
    const msg = inputValue.trim();
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

  const BotAvatar = () =>
    botDisplayName ? (
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: chatTemplate === "bubbles" ? 32 : 28,
          height: chatTemplate === "bubbles" ? 32 : 28,
          background: primaryColor,
          fontSize: chatTemplate === "bubbles" ? 14 : 13,
          fontWeight: 600,
          color: "white",
        }}
      >
        {avatarInitial}
      </div>
    ) : null;

  const ButtonIconSvg = () => {
    const props = {
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "white",
      strokeWidth: 2,
    };
    switch (buttonIcon) {
      case "message":
        return (
          <svg {...props}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case "headset":
        return (
          <svg {...props}>
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        );
      case "sparkle":
        return (
          <svg {...props}>
            <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
          </svg>
        );
      case "bolt":
        return (
          <svg {...props}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      case "help":
        return (
          <svg {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case "robot":
        return (
          <svg {...props}>
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16" />
            <line x1="16" y1="16" x2="16" y2="16" />
          </svg>
        );
      default:
        return (
          <svg {...props}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
    }
  };

  const showWelcome = messages.length === 0;

  // Template-specific styles
  const getModalStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 420,
      maxWidth: "calc(100% - 40px)",
      height: 600,
      maxHeight: "calc(100% - 100px)",
      background: colors.bg,
      border: `1px solid ${colors.border}`,
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
        borderRadius: "24px 24px 0 0",
      };
    }
    if (chatTemplate === "minimal") {
      return {
        padding: "14px 16px",
        background: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
        borderRadius: "8px 8px 0 0",
      };
    }
    return {
      padding: 16,
      background: resolvedHeaderColor,
      borderRadius: "16px 16px 0 0",
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
            {botDisplayName && (
              <div
                className="flex items-center justify-center rounded-md"
                style={{
                  width: 28,
                  height: 28,
                  background: primaryColor,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {avatarInitial}
              </div>
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                {title}
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
                {subtitleText}
              </div>
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
            {botDisplayName && (
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(255,255,255,0.2)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {avatarInitial}
              </div>
            )}
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}>
                {title}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)", marginTop: 2 }}>
                {subtitleText}
              </div>
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
          <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)", marginTop: 2 }}>
            {subtitleText}
          </div>
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
          animation: "chatevo-preview-blink 0.8s infinite",
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
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {msg.content}
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
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {msg.content}
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
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {msg.content}
          {streamCursor}
        </div>
      </div>
    );
  };

  const renderWelcome = () => {
    if (chatTemplate === "bubbles") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          {botDisplayName && (
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 48,
                height: 48,
                background: primaryColor,
                fontSize: 20,
                fontWeight: 600,
                color: "white",
                marginBottom: 12,
              }}
            >
              {avatarInitial}
            </div>
          )}
          <div style={{ fontSize: 16, fontWeight: 500, color: colors.text, marginBottom: 4 }}>
            {welcomeText}
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>
            Ask us anything
          </div>
        </div>
      );
    }

    if (chatTemplate === "minimal") {
      return (
        <div className="flex-1 flex flex-col justify-center p-5">
          <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>
            {welcomeText}
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>
            Ask us anything
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-5">
        <div style={{ fontSize: 15, fontWeight: 400, color: colors.textSecondary, marginBottom: 4 }}>
          {welcomeText}
        </div>
        <div style={{ fontSize: 13, color: colors.textMuted }}>
          Ask us anything
        </div>
      </div>
    );
  };

  const renderSendButton = () => {
    const disabled = !inputValue.trim() || isLoading;

    if (chatTemplate === "bubbles") {
      return (
        <button
          onClick={sendMessage}
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
          onClick={sendMessage}
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
        onClick={sendMessage}
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
        {isOpen ? (
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <ButtonIconSvg />
        )}
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
                          animation: `chatevo-preview-bounce 1.4s infinite ease-in-out`,
                          animationDelay: `${-0.32 + d * 0.16}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
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
            Powered by ChatEvo
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes chatevo-preview-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes chatevo-preview-bounce {
          0%, 80%, 100% { opacity: 0.4; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
