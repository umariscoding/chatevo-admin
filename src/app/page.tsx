"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { APP_CONFIG, ROUTES } from "@/constants/APP_CONSTANTS";

/* ─── Static data ──────────────────────────────────────── */

const steps = [
  {
    number: "01",
    title: "Upload knowledge",
    desc: "Drop in PDFs, docs, or plain text. Our AI ingests and indexes your content for instant retrieval.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Customize & brand",
    desc: "Set your chatbot title, colors, welcome message, and widget position. Make it feel native to your site.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Embed & go live",
    desc: "Copy one script tag, paste it on your site. Your chatbot is live and answering questions in seconds.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
];

const features = [
  {
    title: "Knowledge Base",
    desc: "Upload PDFs, documents, and text. Your chatbot learns from your content and stays up to date.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Smart AI Responses",
    desc: "Powered by advanced LLMs that understand context, handle follow-ups, and cite your sources.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    title: "Embeddable Widget",
    desc: "One script tag adds a fully-featured chat widget to any website. Works everywhere, always.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
  {
    title: "User Analytics",
    desc: "Track conversations, messages, and user engagement. See who is using your chatbot and how.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Custom Branding",
    desc: "Your logo, your colors, your domain. White-label your chatbot to match your brand identity.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125V7.5M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072" />
      </svg>
    ),
  },
  {
    title: "Multi-tenant",
    desc: "Each company gets isolated data, users, and settings. Built for SaaS from the ground up.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "<200ms", label: "Response time" },
  { value: "10K+", label: "Messages / day" },
  { value: "50+", label: "Integrations" },
];

const testimonials = [
  {
    quote: "We cut our support ticket volume by 60% in the first month. The AI actually understands our product and gives accurate answers.",
    name: "Sarah Chen",
    role: "Head of Support",
    company: "Lumenix",
  },
  {
    quote: "Went from 4-hour average response time to instant. Customers noticed immediately — satisfaction scores jumped 30 points.",
    name: "Marcus Rivera",
    role: "CTO",
    company: "Stackline",
  },
  {
    quote: "Setup was absurdly simple. Uploaded our docs, customized the tone, and had it live on our site in under 10 minutes.",
    name: "Priya Sharma",
    role: "Founder",
    company: "Brevity",
  },
];

const faqs = [
  {
    q: "How does the AI train on my data?",
    a: "Upload your documents, FAQs, or paste a website URL. Our AI processes your content and builds a knowledge base specific to your business. You can update it anytime — the chatbot learns continuously.",
  },
  {
    q: "Can I customize the chatbot's appearance?",
    a: "Every visual element is customizable — colors, fonts, avatar, position, and animations. The chatbot will look like a natural part of your website, not a generic widget.",
  },
  {
    q: "What happens when the AI can't answer a question?",
    a: "You define the rules. The chatbot can collect contact information for follow-up, suggest related resources, or display a custom fallback message. Full conversation context is always preserved.",
  },
  {
    q: "What languages are supported?",
    a: `${APP_CONFIG.NAME} supports 50+ languages out of the box. Language detection is automatic — your customers can write in their preferred language and receive responses in that same language.`,
  },
  {
    q: "Is my data secure?",
    a: "Your data is encrypted in transit and at rest. We never use your data to train other models. Each company's data is fully isolated in a multi-tenant architecture.",
  },
  {
    q: "How long does it take to set up?",
    a: "Most teams are live in under 10 minutes. Upload your data, customize the look, copy the embed code — done. No engineering resources required.",
  },
];

/* ─── Logo component ───────────────────────────────────── */

function Logo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none">
      <rect x="2" y="2" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12.5C9 11.12 10.12 10 11.5 10h5c1.38 0 2.5 1.12 2.5 2.5v3c0 1.38-1.12 2.5-2.5 2.5H13l-2.5 2V18h-.5A1.5 1.5 0 019 16.5v-4z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/* ─── Page ─────────────────────────────────────────────── */

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".scroll-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      {/* ── Ambient glow orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-60 -right-40 w-[700px] h-[700px] rounded-full bg-primary-500/[0.07] blur-[140px]" />
        <div className="absolute top-1/3 -left-60 w-[500px] h-[500px] rounded-full bg-primary-500/[0.04] blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-500/[0.03] blur-[100px]" />
      </div>

      {/* ── Subtle grid ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ======================================= NAV ======================================= */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-neutral-950/80 backdrop-blur-2xl border-b border-neutral-800/50" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo className="w-7 h-7 text-primary-400 transition-transform group-hover:scale-110" />
            <span className="text-lg font-semibold tracking-tight">{APP_CONFIG.NAME}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              ["Features", "#features"],
              ["How it Works", "#how-it-works"],
              ["Testimonials", "#testimonials"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href={ROUTES.COMPANY_LOGIN} className="hidden sm:inline-flex text-sm text-neutral-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href={ROUTES.COMPANY_REGISTER}
              className="inline-flex items-center justify-center text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg h-9 px-4 transition-all duration-200 shadow-glow hover:shadow-glow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ======================================= HERO ======================================= */}
      <section className="relative pt-32 lg:pt-40 pb-28 lg:pb-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Copy */}
            <div className="max-w-xl">
              <div className="animate-slide-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/[0.08] text-primary-300 text-xs font-medium tracking-wide uppercase mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" />
                </span>
                Now in public beta
              </div>

              <h1 className="animate-slide-up-d1 text-[3.25rem] sm:text-[4rem] font-bold tracking-tight leading-[1.08] text-white mb-6">
                Your AI&nbsp;support, deployed&nbsp;instantly
              </h1>

              <p className="animate-slide-up-d2 text-lg text-neutral-400 leading-relaxed mb-10 max-w-md">
                Upload your knowledge base. Customize the widget. Embed on any site with one line of code. Your customers get answers — you get insights.
              </p>

              <div className="animate-slide-up-d3 flex flex-wrap items-center gap-3">
                <Link
                  href={ROUTES.COMPANY_REGISTER}
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white rounded-xl h-11 px-6 transition-all duration-200 shadow-glow hover:shadow-glow-lg"
                >
                  Start building free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href={ROUTES.COMPANY_LOGIN}
                  className="inline-flex items-center text-sm font-medium text-neutral-400 border border-neutral-800 hover:border-neutral-600 hover:text-white rounded-xl h-11 px-6 transition-all duration-200"
                >
                  I have an account
                </Link>
              </div>

              <div className="animate-slide-up-d4 mt-12 flex flex-wrap items-center gap-6 sm:gap-8 text-sm text-neutral-500">
                {["No credit card", "5-minute setup", "Free tier"].map((text) => (
                  <span key={text} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Chat mockup */}
            <div className="animate-slide-up-d3 relative hidden lg:block">
              <div className="absolute -inset-8 bg-primary-500/[0.04] rounded-3xl blur-3xl" />

              <div className="relative animate-float-gentle rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                {/* Header */}
                <div className="px-5 py-4 border-b border-neutral-800/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-100">Support Assistant</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                      <p className="text-xs text-neutral-500">Always online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="px-5 py-6 space-y-4 min-h-[320px]">
                  <div className="flex justify-end animate-chat-msg">
                    <div className="bg-primary-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75%]">
                      How do I integrate the chat widget?
                    </div>
                  </div>
                  <div className="flex justify-start animate-chat-msg-d1">
                    <div className="bg-neutral-800 border border-neutral-700/50 text-neutral-300 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%]">
                      Just paste a single <code className="text-primary-300 bg-primary-500/10 px-1.5 py-0.5 rounded text-xs font-mono">&lt;script&gt;</code> tag before your closing <code className="text-primary-300 bg-primary-500/10 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag. That&apos;s it!
                    </div>
                  </div>
                  <div className="flex justify-end animate-chat-msg-d2">
                    <div className="bg-primary-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75%]">
                      Can I customize the colors?
                    </div>
                  </div>
                  <div className="flex justify-start animate-chat-msg-d3">
                    <div className="bg-neutral-800 border border-neutral-700/50 text-neutral-300 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%]">
                      Absolutely. Theme, position, welcome message — everything is configurable from your dashboard.
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="px-5 py-4 border-t border-neutral-800/80">
                  <div className="flex items-center gap-3 bg-neutral-800/60 border border-neutral-700/40 rounded-xl px-4 py-3">
                    <span className="text-sm text-neutral-500 flex-1">Ask anything...</span>
                    <div className="w-2 h-5 bg-primary-400/60 rounded-sm animate-typing-cursor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================= TRUST ======================================= */}
      <section className="relative border-y border-neutral-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-600 mb-8">
            Trusted by teams building the future
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {["SaaS Co", "StartupX", "TechFlow", "DataHive", "CloudOps"].map((name) => (
              <span key={name} className="text-lg font-bold tracking-tight text-neutral-700 hover:text-neutral-500 transition-colors cursor-default select-none">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= HOW IT WORKS ======================================= */}
      <section id="how-it-works" className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal text-center mb-20">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-400 mb-4">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Three steps to live</h2>
            <p className="text-neutral-400 max-w-md mx-auto">Go from zero to a deployed AI chatbot in minutes, not weeks.</p>
          </div>

          <div className="scroll-reveal grid md:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-neutral-800/60">
            {steps.map((item) => (
              <div key={item.number} className="bg-neutral-900/50 p-10 group hover:bg-neutral-800/40 transition-colors duration-300 relative">
                <span className="text-[4rem] font-black text-neutral-800/70 absolute top-4 right-6 leading-none select-none">
                  {item.number}
                </span>
                <div className="text-primary-400 mb-5">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= FEATURES ======================================= */}
      <section id="features" className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal text-center mb-20">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-400 mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Everything you need, nothing you don&apos;t</h2>
            <p className="text-neutral-400 max-w-lg mx-auto">A complete platform for deploying, managing, and scaling AI-powered support chatbots.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="scroll-reveal group border border-neutral-800/60 bg-neutral-900/30 rounded-xl p-6 hover:border-primary-500/30 hover:bg-neutral-800/30 transition-all duration-300"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4 group-hover:bg-primary-500/[0.18] transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= STATS ======================================= */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="scroll-reveal grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label} className="md:border-r md:last:border-r-0 border-neutral-800/50">
                <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-1">{s.value}</p>
                <p className="text-sm text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= INTEGRATION ======================================= */}
      <section className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="scroll-reveal">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-400 mb-4">Integration</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">One line of code</h2>
              <p className="text-neutral-400 leading-relaxed mb-8 max-w-md">
                Add your chatbot to any website — WordPress, Shopify, React, static HTML — with a single script tag. It just works.
              </p>
              <ul className="space-y-3 text-sm text-neutral-400">
                {[
                  "Loads asynchronously — zero performance impact",
                  "Fully responsive across all devices",
                  "Light and dark theme auto-detection",
                  "GDPR-friendly with no third-party cookies",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="scroll-reveal relative" style={{ transitionDelay: "0.15s" }}>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 font-mono text-sm text-neutral-400 leading-relaxed overflow-x-auto shadow-2xl shadow-black/30">
                <div className="flex items-center gap-2 mb-4 text-xs text-neutral-600">
                  <span className="w-3 h-3 rounded-full bg-error-500/60" />
                  <span className="w-3 h-3 rounded-full bg-warning-400/60" />
                  <span className="w-3 h-3 rounded-full bg-accent-400/60" />
                  <span className="ml-2">index.html</span>
                </div>
                <pre className="whitespace-pre-wrap">
{`<`}<span className="text-primary-300">script</span>{`
  `}<span className="text-accent-300">src</span>=<span className="text-warning-300">&quot;https://api.botbeetle.com/embed.js&quot;</span>{`
  `}<span className="text-accent-300">data-company-slug</span>=<span className="text-warning-300">&quot;your-company&quot;</span>{`
  `}<span className="text-accent-300">data-primary-color</span>=<span className="text-warning-300">&quot;#0d9488&quot;</span>{`
  `}<span className="text-accent-300">async</span>{`
>`}<span className="text-primary-300">{`</script>`}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================= TESTIMONIALS ======================================= */}
      <section id="testimonials" className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-400 mb-4">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Loved by support teams</h2>
            <p className="text-neutral-400">See what teams are saying after switching to {APP_CONFIG.NAME}.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="scroll-reveal p-6 lg:p-8 rounded-2xl border border-neutral-800/60 bg-neutral-900/30 flex flex-col"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-primary-400 fill-primary-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-300 leading-relaxed mb-6 flex-1 text-[0.9375rem]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-neutral-800/50">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-400">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">{t.name}</p>
                    <p className="text-xs text-neutral-500">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= FAQ ======================================= */}
      <section id="faq" className="relative py-28 lg:py-36 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="scroll-reveal text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-400 mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Frequently asked questions</h2>
            <p className="text-neutral-400">Everything you need to know about getting started with {APP_CONFIG.NAME}.</p>
          </div>

          <div className="scroll-reveal space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-xl transition-all duration-300 ${
                  openFaq === i
                    ? "border-neutral-700 bg-neutral-900/60"
                    : "border-neutral-800/60 bg-neutral-900/20 hover:border-neutral-700/60"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                >
                  <span className="text-[0.9375rem] font-medium text-neutral-200 pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5">
                      <p className="text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= CTA ======================================= */}
      <section className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal relative overflow-hidden rounded-3xl border border-neutral-800/60 bg-neutral-900/40 px-8 py-16 lg:px-16 lg:py-24 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[280px] bg-primary-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto mb-5">
                Ready to launch your AI chatbot?
              </h2>
              <p className="text-neutral-400 max-w-md mx-auto mb-10">
                Join hundreds of teams using {APP_CONFIG.NAME} to automate support and delight their customers.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={ROUTES.COMPANY_REGISTER}
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white rounded-xl h-12 px-8 transition-all duration-200 shadow-glow hover:shadow-glow-lg"
                >
                  Get started — it&apos;s free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href={ROUTES.COMPANY_LOGIN}
                  className="inline-flex items-center text-sm font-medium text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-white rounded-xl h-12 px-8 transition-all duration-200"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================= FOOTER ======================================= */}
      <footer className="border-t border-neutral-800/50 py-12 lg:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Logo className="w-6 h-6 text-primary-400" />
                <span className="text-base font-semibold">{APP_CONFIG.NAME}</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
                AI-powered customer support that scales with your business.
              </p>
            </div>

            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-semibold text-neutral-300 mb-4">{group.title}</h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-600">
              &copy; {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-neutral-600 hover:text-neutral-400 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="text-neutral-600 hover:text-neutral-400 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              </a>
              <a href="#" className="text-neutral-600 hover:text-neutral-400 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
