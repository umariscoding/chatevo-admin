"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PipecatClient, RTVIEvent } from "@pipecat-ai/client-js";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";
import { API_CONFIG } from "@/constants/api";
import { usePlan } from "@/hooks/usePlan";
import UpgradePrompt from "@/components/billing/UpgradePrompt";

interface TranscriptEntry {
  role: "agent" | "user" | "system";
  text: string;
}

type CallState = "idle" | "connecting" | "active" | "ended";

interface Props {
  open: boolean;
  onClose: () => void;
}

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function TestCallPanel({ open, onClose }: Props) {
  const { isFree } = usePlan();
  const [callState, setCallState] = useState<CallState>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [duration, setDuration] = useState(0);
  const [mounted, setMounted] = useState(false);

  const clientRef = useRef<PipecatClient | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);
  useEffect(() => {
    if (callState === "active") {
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const addMsg = useCallback(
    (role: TranscriptEntry["role"], text: string) =>
      setTranscript((p) => [...p, { role, text }]),
    []
  );

  const teardown = useCallback(async () => {
    try {
      await clientRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    clientRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
    }
  }, []);

  const startCall = useCallback(async () => {
    setCallState("connecting");
    setTranscript([]);
    setDuration(0);

    const token = localStorage.getItem("company_access_token");
    if (!token) {
      addMsg("system", "Not authenticated.");
      setCallState("idle");
      return;
    }

    const transport = new SmallWebRTCTransport({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const client = new PipecatClient({
      transport,
      enableMic: true,
      enableCam: false,
      callbacks: {
        onConnected: () => {
          setCallState("active");
          addMsg("system", "Connected — speak naturally");
        },
        onDisconnected: () => {
          setCallState((prev) => (prev === "ended" ? prev : "ended"));
          addMsg("system", "Call ended");
        },
        onBotReady: () => {
          /* bot is ready; pipeline already kicked off greeting via on_client_connected */
        },
        onUserTranscript: (data) => {
          if (data.final && data.text) addMsg("user", data.text);
        },
        onBotTranscript: (data) => {
          if (data.text) addMsg("agent", data.text);
        },
        onError: (msg) => {
          const text =
            (msg?.data as { error?: string } | undefined)?.error || "Connection error";
          addMsg("system", text);
          setCallState("ended");
        },
        onTrackStarted: (track: MediaStreamTrack, participant) => {
          // Only attach the bot's audio track (skip our own mic loopback).
          if (track.kind !== "audio" || participant?.local) return;
          if (audioRef.current) {
            const stream = new MediaStream([track]);
            audioRef.current.srcObject = stream;
            audioRef.current.play().catch(() => {
              /* autoplay may be blocked until user gesture; the Start button
               * itself is the gesture so this should rarely fail. */
            });
          }
        },
      },
    });

    clientRef.current = client;

    try {
      await client.connect({
        webrtcRequestParams: {
          endpoint: `${API_CONFIG.BASE_URL}/voice-agent/offer?token=${encodeURIComponent(token)}`,
        },
      });
    } catch (err: any) {
      addMsg("system", err?.message || "Failed to connect");
      setCallState("idle");
      await teardown();
    }
  }, [addMsg, teardown]);

  const endCall = useCallback(async () => {
    await teardown();
    setCallState("ended");
  }, [teardown]);

  // Tear down on unmount.
  useEffect(() => {
    return () => {
      teardown();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [teardown]);

  // Tear down when panel closes.
  useEffect(() => {
    if (!open && callState !== "idle") {
      teardown();
      setCallState("idle");
    }
  }, [open, callState, teardown]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={() => {
        if (callState === "active") return;
        onClose();
      }}
    >
      <div
        className="bg-white dark:bg-[#0E1515] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-neutral-200 dark:border-white/[0.06]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Icons.Phone className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Test Call</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Talk to your agent in the browser</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (callState === "active") return;
              onClose();
            }}
            disabled={callState === "active"}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/[0.04] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title={callState === "active" ? "End call first" : "Close"}
          >
            <Icons.Close className="h-4 w-4 text-slate-400 dark:text-slate-400" />
          </button>
        </div>

        {/* Pro gate */}
        {isFree ? (
          <div className="px-5 py-6 border-b border-slate-100 dark:border-white/[0.06]">
            <UpgradePrompt
              feature="Voice Agent"
              description="Upgrade to Pro to test calls in your browser and receive Twilio calls."
            />
          </div>
        ) : (
        <div className="px-5 py-6 border-b border-slate-100 dark:border-white/[0.06] flex flex-col items-center">
          <div
            className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-all ${
              callState === "active"
                ? "bg-primary-100 dark:bg-teal-500/15"
                : callState === "connecting"
                ? "bg-amber-100 dark:bg-amber-500/15"
                : "bg-neutral-100 dark:bg-white/[0.04]"
            }`}
          >
            {callState === "active" && (
              <span className="absolute inset-0 rounded-full bg-teal-500 dark:bg-teal-400 animate-ping opacity-20" />
            )}
            {callState === "active" ? (
              <Icons.Mic className="h-8 w-8 text-primary-600 dark:text-primary-400 relative z-10" />
            ) : callState === "connecting" ? (
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icons.Phone className="h-8 w-8 text-slate-400 dark:text-slate-400" />
            )}
          </div>

          {(callState === "active" || callState === "ended") && (
            <p
              className={`text-2xl font-mono font-semibold mb-1 ${
                callState === "active" ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-400"
              }`}
            >
              {fmtTime(duration)}
            </p>
          )}

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {callState === "idle" && "Ready to test"}
            {callState === "connecting" && "Connecting..."}
            {callState === "active" && "Call in progress"}
            {callState === "ended" && "Call ended"}
          </p>

          {callState === "active" ? (
            <button
              onClick={endCall}
              className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors active:scale-95"
              title="End call"
            >
              <Icons.Phone className="h-5 w-5 rotate-[135deg]" />
            </button>
          ) : (
            <Button onClick={startCall} size="md">
              <Icons.Phone className="h-3.5 w-3.5" />
              {callState === "ended" ? "Call Again" : "Start Call"}
            </Button>
          )}
        </div>
        )}

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {transcript.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-600">
              <Icons.MessageCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">Start a call to see transcript</p>
            </div>
          ) : (
            transcript.map((e, i) => (
              <div
                key={i}
                className={`flex ${e.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                    e.role === "user"
                      ? "bg-primary-600 text-white rounded-br-md"
                      : e.role === "agent"
                      ? "bg-neutral-100 dark:bg-white/[0.04] text-slate-800 dark:text-slate-100 rounded-bl-md"
                      : "bg-neutral-50 dark:bg-transparent text-slate-500 dark:text-slate-400 text-xs w-full text-center border border-slate-100 dark:border-white/[0.06]"
                  }`}
                >
                  {e.role !== "system" && (
                    <p
                      className={`text-[10px] font-medium mb-0.5 ${
                        e.role === "user" ? "text-primary-200" : "text-slate-400 dark:text-slate-400"
                      }`}
                    >
                      {e.role === "user" ? "You" : "Agent"}
                    </p>
                  )}
                  {e.text}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Hidden audio sink — bot's voice plays here. */}
        <audio ref={audioRef} autoPlay playsInline />
      </div>
    </div>,
    document.body
  );
}
