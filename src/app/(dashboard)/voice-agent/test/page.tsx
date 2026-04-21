"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";
import { API_CONFIG } from "@/constants/api";

interface TranscriptEntry {
  role: "agent" | "user" | "system";
  text: string;
}

type CallState = "idle" | "connecting" | "active" | "ended";

export default function TestCallPage() {
  const router = useRouter();
  const [callState, setCallState] = useState<CallState>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [duration, setDuration] = useState(0);
  const [booked, setBooked] = useState<any[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nextPlayRef = useRef(0);
  const stateRef = useRef<CallState>("idle");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { stateRef.current = callState; }, [callState]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [transcript]);
  useEffect(() => {
    if (callState === "active")
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const addMsg = useCallback(
    (role: TranscriptEntry["role"], text: string) =>
      setTranscript((p) => [...p, { role, text }]),
    []
  );

  const playAudio = useCallback((data: ArrayBuffer) => {
    const ctx = outputCtxRef.current;
    if (!ctx || ctx.state === "closed") return;
    if (ctx.state === "suspended") ctx.resume();
    const i16 = new Int16Array(data);
    const f32 = new Float32Array(i16.length);
    for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768;
    const buf = ctx.createBuffer(1, f32.length, 24000);
    buf.copyToChannel(f32, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    const t = Math.max(ctx.currentTime, nextPlayRef.current);
    src.start(t);
    nextPlayRef.current = t + buf.duration;
  }, []);

  const startCall = useCallback(async () => {
    setCallState("connecting");
    setTranscript([]);
    setDuration(0);
    setBooked([]);
    nextPlayRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      const inCtx = new AudioContext();
      inputCtxRef.current = inCtx;
      const outCtx = new AudioContext({ sampleRate: 24000 });
      outputCtxRef.current = outCtx;
      await outCtx.resume();

      const token = localStorage.getItem("company_access_token");
      if (!token) { addMsg("system", "Not authenticated."); setCallState("idle"); return; }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const cid = payload.company_id || payload.sub;

      const ws = new WebSocket(
        `${API_CONFIG.BASE_URL.replace("http", "ws")}/voice-agent/agent/${cid}?token=${token}`
      );
      wsRef.current = ws;
      ws.binaryType = "arraybuffer";

      ws.onopen = () => ws.send(JSON.stringify({ sample_rate: inCtx.sampleRate }));

      ws.onmessage = (ev) => {
        if (ev.data instanceof ArrayBuffer) { playAudio(ev.data); return; }
        try {
          const m = JSON.parse(ev.data);
          if (m.type === "Ready") {
            setCallState("active");
            addMsg("system", "Connected — speak naturally");
            const source = inCtx.createMediaStreamSource(stream);
            const proc = inCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = proc;
            proc.onaudioprocess = (e) => {
              if (ws.readyState !== WebSocket.OPEN) return;
              const inp = e.inputBuffer.getChannelData(0);
              const i16 = new Int16Array(inp.length);
              for (let i = 0; i < inp.length; i++) {
                const s = Math.max(-1, Math.min(1, inp[i]));
                i16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
              }
              ws.send(i16.buffer);
            };
            source.connect(proc);
            proc.connect(inCtx.destination);
          } else if (m.type === "ConversationText") {
            if (m.role === "assistant" || m.role === "agent") addMsg("agent", m.content);
            else if (m.role === "user") addMsg("user", m.content);
          } else if (m.type === "AppointmentBooked") {
            setBooked((p) => [...p, m.appointment]);
            addMsg("system", `Booked: ${m.appointment?.scheduled_date} at ${m.appointment?.start_time}`);
          } else if (m.type === "Error") {
            addMsg("system", m.description || "Error");
          }
        } catch { /* ignore */ }
      };

      ws.onerror = () => { addMsg("system", "Connection error"); setCallState("idle"); };
      ws.onclose = () => {
        if (stateRef.current !== "idle" && stateRef.current !== "ended") {
          setCallState("ended");
          addMsg("system", "Call ended");
        }
      };
    } catch (err: any) {
      addMsg("system", err.message || "Mic access denied");
      setCallState("idle");
    }
  }, [addMsg, playAudio]);

  const endCall = useCallback(() => {
    wsRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    processorRef.current?.disconnect();
    if (inputCtxRef.current?.state !== "closed") inputCtxRef.current?.close();
    if (outputCtxRef.current?.state !== "closed") outputCtxRef.current?.close();
    wsRef.current = null;
    streamRef.current = null;
    processorRef.current = null;
    inputCtxRef.current = null;
    outputCtxRef.current = null;
    nextPlayRef.current = 0;
    setCallState("ended");
  }, []);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (inputCtxRef.current?.state !== "closed") inputCtxRef.current?.close();
      if (outputCtxRef.current?.state !== "closed") outputCtxRef.current?.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/voice-agent")}
          className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Icons.ArrowLeft className="h-4 w-4 text-neutral-500" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Test Call</h2>
          <p className="text-sm text-neutral-500">
            Talk to your voice agent through the browser
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Call Panel */}
        <div>
          <div className="bg-white rounded-lg border border-neutral-200 p-5 flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                callState === "active"
                  ? "bg-primary-100"
                  : callState === "connecting"
                  ? "bg-amber-100"
                  : "bg-neutral-100"
              }`}
            >
              {callState === "active" ? (
                <Icons.Mic className="h-7 w-7 text-primary-600" />
              ) : callState === "connecting" ? (
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icons.Phone className="h-7 w-7 text-neutral-400" />
              )}
            </div>

            {(callState === "active" || callState === "ended") && (
              <p
                className={`text-lg font-mono font-semibold mb-2 ${
                  callState === "active" ? "text-primary-600" : "text-neutral-400"
                }`}
              >
                {fmtTime(duration)}
              </p>
            )}

            <p className="text-sm text-neutral-500 mb-4">
              {callState === "idle" && "Ready to test"}
              {callState === "connecting" && "Connecting..."}
              {callState === "active" && "Call in progress"}
              {callState === "ended" && "Call ended"}
            </p>

            {callState === "idle" || callState === "ended" ? (
              <Button onClick={startCall} size="sm" className="w-full">
                <Icons.Phone className="h-3.5 w-3.5" />
                {callState === "ended" ? "Call Again" : "Start Call"}
              </Button>
            ) : callState === "active" ? (
              <button
                onClick={endCall}
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              >
                <Icons.Phone className="h-5 w-5 rotate-[135deg]" />
              </button>
            ) : null}

            {booked.length > 0 && (
              <div className="w-full mt-4 pt-4 border-t border-neutral-100">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Booked
                </p>
                {booked.map((a, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 bg-primary-50 border border-primary-100 rounded-lg text-sm mb-1.5"
                  >
                    <p className="font-medium text-primary-800">
                      {a.caller_name || "Appointment"}
                    </p>
                    <p className="text-xs text-primary-600">
                      {a.scheduled_date} at {a.start_time?.slice(0, 5)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Transcript
              </p>
              {transcript.length > 0 && (
                <button
                  onClick={() => setTranscript([])}
                  className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="h-[400px] overflow-y-auto px-5 py-4 space-y-2">
              {transcript.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-300">
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
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        e.role === "user"
                          ? "bg-primary-600 text-white"
                          : e.role === "agent"
                          ? "bg-neutral-100 text-neutral-800"
                          : "bg-neutral-50 text-neutral-500 text-xs w-full text-center border border-neutral-100"
                      }`}
                    >
                      {e.role !== "system" && (
                        <p
                          className={`text-[10px] font-medium mb-0.5 ${
                            e.role === "user" ? "text-primary-200" : "text-neutral-400"
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
          </div>
        </div>
      </div>
    </div>
  );
}
