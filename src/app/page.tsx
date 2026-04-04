"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { APP_CONFIG, ROUTES } from "@/constants/APP_CONSTANTS";

/* ─── Data ─────────────────────────────────────────────── */

const rotatingWords = ["WordPress", "Shopify", "React", "any website"];

const featureList = [
  "Upload PDFs, docs, and URLs as knowledge base",
  "AI learns and indexes your content automatically",
  "Customize appearance, tone, and behavior",
  "Embed on any site with one script tag",
  "Track conversations and user engagement",
];

const faqs = [
  {
    q: "How does the AI train on my data?",
    a: "Upload your documents, FAQs, or paste a website URL. Our AI processes your content and builds a knowledge base specific to your business. You can update it anytime.",
  },
  {
    q: "Can I customize the chatbot's appearance?",
    a: "Every visual element is customizable — colors, fonts, avatar, position, and animations. The chatbot will look like a natural part of your website.",
  },
  {
    q: "What happens when the AI can't answer?",
    a: "You define the rules. The chatbot can collect contact info, suggest resources, or display a fallback message. Full conversation context is always preserved.",
  },
  {
    q: "What languages are supported?",
    a: `${APP_CONFIG.NAME} supports 50+ languages out of the box. Language detection is automatic — your customers can write in their preferred language.`,
  },
  {
    q: "Is my data secure?",
    a: "Your data is encrypted in transit and at rest. We never use your data to train other models. Each company's data is fully isolated.",
  },
  {
    q: "How long does it take to set up?",
    a: "Most teams are live in under 10 minutes. Upload your data, customize the look, copy the embed code — done.",
  },
];

/* ─── Page ─────────────────────────────────────────────── */

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 overflow-x-hidden">
      {/* ═══════════ NAV ═══════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            : ""
        }`}
      >
        <div className="w-full px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt={APP_CONFIG.NAME}
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold tracking-tight">
              {APP_CONFIG.NAME}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              ["Features", "#features"],
              ["Platform", "#platform"],
              ["Pricing", "#pricing"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.COMPANY_LOGIN}
              className="hidden sm:inline-flex items-center justify-center text-sm font-medium text-neutral-600 border border-neutral-200 hover:border-neutral-300 rounded-full h-10 px-5 transition-colors"
            >
              Login
            </Link>
            <Link
              href={ROUTES.COMPANY_REGISTER}
              className="inline-flex items-center justify-center text-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white rounded-full h-10 px-5 transition-colors"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO + PRODUCT MOCKUP ═══════════ */}
      <section className="relative pt-36 lg:pt-48 pb-0 overflow-hidden">
        {/* Geometric bg — covers hero and mockup */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-24 -left-8 w-44 h-44 bg-primary-100/40 rounded-3xl rotate-12" />
          <div className="absolute top-16 right-12 w-56 h-36 bg-primary-50/50 rounded-3xl -rotate-6" />
          <div className="absolute bottom-[40%] left-[20%] w-52 h-52 bg-primary-100/25 rounded-3xl rotate-45" />
          <div className="absolute top-[30%] right-[22%] w-36 h-64 bg-primary-50/35 rounded-3xl -rotate-12" />
          <div className="absolute bottom-[30%] right-16 w-40 h-40 bg-primary-100/30 rounded-3xl rotate-6" />
          <div className="absolute bottom-[20%] left-[8%] w-32 h-32 bg-primary-50/30 rounded-3xl -rotate-45" />
        </div>

        {/* Hero text */}
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h1 className="animate-slide-up text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-neutral-900 mb-6">
            Your AI support,
            <br />
            deployed on
            <br />
            <span className="relative inline-block">
              <span className="invisible" aria-hidden="true">
                any website
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center text-primary-400 transition-all duration-300 ${
                  isAnimating
                    ? "opacity-0 -translate-y-3"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {rotatingWords[wordIndex]}
              </span>
            </span>
          </h1>

          <p className="animate-slide-up-d1 text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your knowledge base, customize the widget, embed on any site
            with one line of code.
          </p>

          <div className="animate-slide-up-d2 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 lg:mb-24">
            <Link
              href={ROUTES.COMPANY_REGISTER}
              className="inline-flex items-center justify-center text-base font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-full h-14 px-10 transition-all shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25"
            >
              Sign up for free
            </Link>
            <Link
              href={ROUTES.COMPANY_LOGIN}
              className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Already have an account?{" "}
              <span className="underline">Sign in</span>
            </Link>
          </div>
        </div>

        {/* Product mockup — cropped at bottom, no bottom border */}
        <div className="relative max-w-6xl mx-auto px-6 animate-slide-up-d3">
          <div className="rounded-t-[20px] border-[6px] border-b-0 border-neutral-900 overflow-hidden shadow-2xl shadow-neutral-400/30">
            <Image
              src="/screenshots/dashboard.png"
              alt="Wispoke Dashboard"
              width={2800}
              height={1800}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST ═══════════ */}
      <section className="relative py-14 px-6 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-8">
            Trusted by teams building the future
          </p>
          <div className="flex items-center justify-center gap-10 sm:gap-14 flex-wrap">
            {["SaaS Co", "StartupX", "TechFlow", "DataHive", "CloudOps"].map(
              (name) => (
                <span
                  key={name}
                  className="text-lg font-bold tracking-tight text-neutral-200 select-none"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ BENTO GRID ═══════════ */}
      <section className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-16 max-w-xl">
              Everything you need to deploy AI&nbsp;support
            </h2>
          </div>

          <div className="scroll-reveal grid lg:grid-cols-3 gap-5 auto-rows-[240px]">
            {/* Large card — product screenshot */}
            <div className="lg:col-span-2 lg:row-span-2 bg-neutral-50 rounded-3xl overflow-hidden relative flex flex-col">
              <div className="p-8 lg:p-10 relative z-10">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-neutral-500 border border-neutral-200 rounded-full px-3 py-1 mb-5">
                  Platform
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 max-w-sm leading-snug">
                  Full visibility into every conversation
                </h3>
              </div>
              {/* Screenshot — overflows and crops at bottom */}
              <div className="mt-auto px-6 lg:px-8 flex-1 relative min-h-0">
                <div className="rounded-t-xl border-[4px] border-b-0 border-neutral-900 overflow-hidden shadow-xl h-full">
                  <Image
                    src="/screenshots/embedscreen.png"
                    alt="Wispoke platform — widget customization and live preview"
                    width={2800}
                    height={1800}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Top-right — stat card */}
            <div className="bg-neutral-50 rounded-3xl p-8 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-4xl font-black text-neutral-900 tracking-tight">&lt;10 min</p>
                <p className="text-sm text-neutral-500 mt-1">Average setup time from signup to live chatbot</p>
              </div>
            </div>

            {/* Bottom-right — accent card */}
            <div className="bg-primary-50 rounded-3xl p-8 flex flex-col justify-between">
              <p className="text-lg font-bold text-neutral-900 leading-snug">
                Train your chatbot on your own data.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["PDF", "DOCX", "URL", "TXT", "MD"].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-bold tracking-wider text-primary-700 bg-primary-100 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: text list */}
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4 block">
                Features
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-12">
                Upload knowledge,
                <br />
                deploy instantly
              </h2>
              <div className="divide-y divide-neutral-200">
                {featureList.map((f) => (
                  <p
                    key={f}
                    className="py-5 text-lg text-neutral-700 font-medium"
                  >
                    {f}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: floating UI cards */}
            <div className="relative hidden lg:block min-h-[500px]">
              {/* Card 1: Knowledge Base */}
              <div className="absolute top-0 left-8 w-[320px] bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/50 overflow-hidden z-10">
                <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">
                    Knowledge Base
                  </span>
                  <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    + Upload
                  </span>
                </div>
                <div className="p-3 space-y-1.5">
                  {[
                    { name: "product-guide.pdf", done: true },
                    { name: "faq-responses.docx", done: true },
                    { name: "api-docs.md", done: false },
                  ].map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center gap-2.5 bg-neutral-50 rounded-lg px-3 py-2"
                    >
                      <div
                        className={`w-4 h-4 rounded flex-shrink-0 ${f.done ? "bg-primary-100" : "bg-amber-100"}`}
                      />
                      <span className="text-xs text-neutral-700 flex-1 truncate">
                        {f.name}
                      </span>
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${f.done ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"}`}
                      >
                        {f.done ? "Indexed" : "Processing"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Chat conversation */}
              <div className="absolute top-32 right-0 w-[300px] bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/50 overflow-hidden z-20 rotate-2">
                <div className="px-5 py-3 border-b border-neutral-100">
                  <span className="text-sm font-semibold text-neutral-900">
                    Live Chat
                  </span>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex justify-end">
                    <div className="bg-primary-500 text-white text-xs px-3 py-2 rounded-xl rounded-br-sm max-w-[75%]">
                      What&apos;s your refund policy?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 text-neutral-700 text-xs px-3 py-2 rounded-xl rounded-bl-sm max-w-[80%]">
                      Full refunds within 30 days of purchase.
                      <span className="block text-[9px] text-primary-500 mt-1 font-medium">
                        Source: refund-policy.pdf
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Floating status pill */}
              <div className="absolute bottom-16 left-16 bg-white rounded-full border border-neutral-200 shadow-lg px-4 py-2.5 flex items-center gap-2 z-30 -rotate-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-neutral-700">
                  Chatbot Live
                </span>
                <span className="text-[10px] text-neutral-400">
                  94% resolution
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EMBED WIDGET ═══════════ */}
      <section className="relative py-28 lg:py-36 px-6 bg-neutral-50/70 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal text-center mb-16">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-neutral-500 border border-neutral-200 rounded-full px-3 py-1 mb-5">
              Embed Widget
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-5">
              Your brand, your chatbot
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto">
              Customize colors, templates, welcome messages, and see changes
              live before you publish.
            </p>
          </div>

          {/* Screenshot — full width, cropped bottom */}
          <div className="scroll-reveal relative max-w-5xl mx-auto">
            <div className="rounded-t-[20px] border-[5px] border-b-0 border-neutral-900 overflow-hidden shadow-2xl shadow-neutral-300/40">
              <Image
                src="/screenshots/embedcropped.png"
                alt="Widget customization — edit colors, messages, templates, with live preview"
                width={1400}
                height={900}
                className="w-full h-auto"
              />
            </div>

            {/* Floating feature pills */}
            <div className="absolute -left-4 top-[30%] bg-white rounded-full shadow-lg border border-neutral-100 px-4 py-2 flex items-center gap-2 hidden lg:flex">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold text-neutral-700">3 chat templates</span>
            </div>
            <div className="absolute -right-4 top-[20%] bg-white rounded-full shadow-lg border border-neutral-100 px-4 py-2 flex items-center gap-2 hidden lg:flex">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-neutral-700">Live preview</span>
            </div>
            <div className="absolute -right-2 bottom-[25%] bg-white rounded-full shadow-lg border border-neutral-100 px-4 py-2 flex items-center gap-2 hidden lg:flex">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-neutral-700">Quick replies</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PLATFORMS ═══════════ */}
      <section id="platform" className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-5">
              Deploy everywhere
            </h2>
            <p className="text-neutral-500 text-lg max-w-md mx-auto">
              One script tag. Any platform. Your chatbot works wherever your
              customers are.
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {/* Accent card */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 flex flex-col justify-between col-span-2 sm:col-span-1 row-span-2">
              <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              <p className="text-sm font-semibold leading-snug mt-4">
                Embed on any website with a single line of code.
              </p>
            </div>

            {/* WordPress */}
            <div className="bg-neutral-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:bg-neutral-100 transition-colors">
              <svg className="w-8 h-8 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/>
              </svg>
              <span className="text-xs font-semibold text-neutral-600">WordPress</span>
            </div>

            {/* Shopify */}
            <div className="bg-neutral-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:bg-neutral-100 transition-colors">
              <svg className="w-8 h-8 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83z"/>
              </svg>
              <span className="text-xs font-semibold text-neutral-600">Shopify</span>
            </div>

            {/* React */}
            <div className="bg-neutral-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:bg-neutral-100 transition-colors">
              <svg className="w-8 h-8 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
              </svg>
              <span className="text-xs font-semibold text-neutral-600">React</span>
            </div>

            {/* Webflow */}
            <div className="bg-neutral-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:bg-neutral-100 transition-colors">
              <svg className="w-8 h-8 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="m24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z"/>
              </svg>
              <span className="text-xs font-semibold text-neutral-600">Webflow</span>
            </div>

            {/* Next.js */}
            <div className="bg-neutral-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:bg-neutral-100 transition-colors">
              <svg className="w-8 h-8 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"/>
              </svg>
              <span className="text-xs font-semibold text-neutral-600">Next.js</span>
            </div>

            {/* HTML5 */}
            <div className="bg-neutral-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:bg-neutral-100 transition-colors">
              <svg className="w-8 h-8 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
              </svg>
              <span className="text-xs font-semibold text-neutral-600">HTML5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ INTEGRATION ═══════════ */}
      <section className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="scroll-reveal">
              <span className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4 block">
                Integration
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
                One line of code
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-8 max-w-md text-lg">
                Add your chatbot to any website with a single script tag.
              </p>
              <ul className="space-y-3 text-sm text-neutral-500">
                {[
                  "Loads asynchronously — zero performance impact",
                  "Fully responsive across all devices",
                  "Light and dark theme auto-detection",
                  "GDPR-friendly with no third-party cookies",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg
                      className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="scroll-reveal relative"
              style={{ transitionDelay: "0.15s" }}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-neutral-300/40 border border-neutral-200">
                <div className="bg-neutral-800 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-xs text-neutral-500">index.html</span>
                </div>
                <div className="bg-neutral-900 p-6 font-mono text-sm text-neutral-400 leading-relaxed">
                  <pre className="whitespace-pre-wrap">
                    {`<`}
                    <span className="text-sky-300">script</span>
                    {`\n  `}
                    <span className="text-orange-300">src</span>=
                    <span className="text-emerald-300">
                      &quot;https://api.wispoke.com/embed.js&quot;
                    </span>
                    {`\n  `}
                    <span className="text-orange-300">data-company-slug</span>=
                    <span className="text-emerald-300">
                      &quot;your-company&quot;
                    </span>
                    {`\n  `}
                    <span className="text-orange-300">data-primary-color</span>=
                    <span className="text-emerald-300">
                      &quot;#0d9488&quot;
                    </span>
                    {`\n  `}
                    <span className="text-orange-300">async</span>
                    {`\n>`}
                    <span className="text-sky-300">{`</script>`}</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SOCIAL PROOF ═══════════ */}
      <section className="relative py-16 px-6 border-y border-neutral-100">
        <div className="scroll-reveal max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-5">
          <div className="flex -space-x-2.5">
            {[
              "bg-primary-200",
              "bg-blue-200",
              "bg-amber-200",
              "bg-rose-200",
              "bg-violet-200",
            ].map((color, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full border-2 border-white ${color} flex items-center justify-center text-xs font-semibold text-neutral-600 shadow-sm`}
              >
                {["SK", "MR", "JL", "AP", "TC"][i]}
              </div>
            ))}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-neutral-900">
              Trusted by 500+ teams worldwide
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-xs text-neutral-400 ml-1">
                4.9/5 average rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section id="faq" className="relative py-28 lg:py-36 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="scroll-reveal text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4 block">
              FAQ
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
              Common questions
            </h2>
          </div>

          <div className="scroll-reveal divide-y divide-neutral-200">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
                >
                  <span className="text-[0.9375rem] font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors pr-4">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-neutral-300 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    openFaq === i
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5">
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-28 lg:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 lg:px-16 lg:py-24 text-center">
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute top-10 left-10 w-40 h-40 bg-primary-500/10 rounded-3xl rotate-12" />
              <div className="absolute bottom-10 right-10 w-56 h-56 bg-primary-500/5 rounded-3xl -rotate-6" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto mb-5">
                Ready to launch your AI&nbsp;chatbot?
              </h2>
              <p className="text-neutral-400 max-w-md mx-auto mb-10 text-lg">
                Join hundreds of teams using {APP_CONFIG.NAME} to automate
                support.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={ROUTES.COMPANY_REGISTER}
                  className="inline-flex items-center justify-center text-base font-semibold bg-white hover:bg-neutral-100 text-neutral-900 rounded-full h-14 px-10 transition-colors shadow-lg"
                >
                  Get started — it&apos;s free
                </Link>
                <Link
                  href={ROUTES.COMPANY_LOGIN}
                  className="inline-flex items-center justify-center text-sm font-medium text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-white rounded-full h-12 px-8 transition-all"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-neutral-100 py-12 lg:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Image
                  src="/logo.png"
                  alt={APP_CONFIG.NAME}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="text-base font-bold">
                  {APP_CONFIG.NAME}
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                AI-powered customer support that scales with your business.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Changelog"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "GDPR"],
              },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-semibold text-neutral-900 mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">
              &copy; {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights
              reserved.
            </p>
            <div className="flex items-center gap-5">
              <a
                href="#"
                className="text-neutral-300 hover:text-neutral-500 transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-300 hover:text-neutral-500 transition-colors"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-300 hover:text-neutral-500 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
