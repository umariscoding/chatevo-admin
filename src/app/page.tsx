import React from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";
import { APP_CONFIG, ROUTES } from "@/constants/APP_CONSTANTS";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* ---- Ambient gradient orbs ---- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary-600/[0.07] blur-[120px] animate-float-orb" />
        <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full bg-accent-500/[0.05] blur-[100px] animate-float-orb-reverse" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-primary-400/[0.04] blur-[80px] animate-float-orb" style={{ animationDelay: "5s" }} />
      </div>

      {/* ---- Subtle grid overlay ---- */}
      <div
        className="fixed inset-0 pointer-events-none animate-grid-pulse"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ====== NAVIGATION ====== */}
      <nav className="relative z-50 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg className="w-7 h-7 text-primary-400 transition-transform group-hover:scale-110" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12.5C9 11.12 10.12 10 11.5 10h5c1.38 0 2.5 1.12 2.5 2.5v3c0 1.38-1.12 2.5-2.5 2.5H13l-2.5 2V18h-.5A1.5 1.5 0 019 16.5v-4z" fill="currentColor" opacity="0.7"/>
            </svg>
            <span className="text-lg font-semibold tracking-tight">{APP_CONFIG.NAME}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href={ROUTES.COMPANY_LOGIN}>
              <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-white/[0.06]">
                Sign in
              </Button>
            </Link>
            <Link href={ROUTES.COMPANY_REGISTER}>
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className="relative pt-28 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Copy */}
            <div className="max-w-xl">
              <div className="animate-slide-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/[0.06] text-primary-300 text-xs font-medium tracking-wide uppercase mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" />
                </span>
                Now in public beta
              </div>

              <h1 className="animate-slide-up-d1 text-[3.5rem] sm:text-[4rem] font-bold tracking-tight leading-[1.05] mb-6">
                Your AI&nbsp;support,
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
                  deployed&nbsp;instantly
                </span>
              </h1>

              <p className="animate-slide-up-d2 text-lg text-neutral-400 leading-relaxed mb-10 max-w-md">
                Upload your knowledge base. Customize the widget. Embed on any site with one line of code. Your customers get answers — you get insights.
              </p>

              <div className="animate-slide-up-d3 flex items-center gap-3">
                <Link href={ROUTES.COMPANY_REGISTER}>
                  <Button size="lg" className="shadow-lg shadow-primary-600/20">
                    Start building free
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href={ROUTES.COMPANY_LOGIN} className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors px-3 py-2">
                  I have an account
                </Link>
              </div>

              <div className="animate-slide-up-d4 mt-12 flex items-center gap-8 text-sm text-neutral-500">
                {["No credit card", "5-minute setup", "Free tier"].map((text) => (
                  <span key={text} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Animated chat mockup */}
            <div className="animate-slide-up-d3 relative hidden lg:block">
              <div className="absolute inset-0 -m-8 bg-gradient-to-br from-primary-600/10 via-transparent to-accent-500/10 blur-2xl rounded-3xl animate-pulse-glow" />

              <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-400/80" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">Support Assistant</p>
                    <p className="text-xs text-neutral-500">Always online</p>
                  </div>
                </div>

                <div className="px-5 py-6 space-y-4 min-h-[340px]">
                  <div className="flex justify-end animate-chat-msg">
                    <div className="bg-primary-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75%]">
                      How do I integrate the chat widget?
                    </div>
                  </div>

                  <div className="flex justify-start animate-chat-msg-d1">
                    <div className="bg-white/[0.06] border border-white/[0.08] text-neutral-300 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%]">
                      Just paste a single <code className="text-primary-300 bg-primary-500/10 px-1.5 py-0.5 rounded text-xs font-mono">&lt;script&gt;</code> tag before your closing <code className="text-primary-300 bg-primary-500/10 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag. That&apos;s it!
                    </div>
                  </div>

                  <div className="flex justify-end animate-chat-msg-d2">
                    <div className="bg-primary-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75%]">
                      Can I customize the colors?
                    </div>
                  </div>

                  <div className="flex justify-start animate-chat-msg-d3">
                    <div className="bg-white/[0.06] border border-white/[0.08] text-neutral-300 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%]">
                      Absolutely. Choose from presets or set any hex color. Theme, position, welcome message — everything is configurable from your dashboard.
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3">
                    <span className="text-sm text-neutral-500 flex-1">Ask anything...</span>
                    <div className="w-2 h-5 bg-primary-400/60 rounded-sm animate-typing-cursor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TRUST ====== */}
      <section className="relative border-y border-white/[0.04] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-600 mb-8">Trusted by teams building the future</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-30">
            {["SaaS Co", "StartupX", "TechFlow", "DataHive", "CloudOps"].map((name) => (
              <span key={name} className="text-lg font-bold tracking-tight text-neutral-400">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-400 mb-4">How it works</p>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Three steps to live</h2>
            <p className="text-neutral-500 max-w-md mx-auto">Go from zero to a deployed AI chatbot in minutes, not weeks.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {[
              {
                step: "01",
                title: "Upload knowledge",
                desc: "Drop in PDFs, docs, or plain text. Our AI ingests and indexes your content for instant retrieval.",
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
              },
              {
                step: "02",
                title: "Customize & brand",
                desc: "Set your chatbot title, colors, welcome message, and widget position. Match your brand perfectly.",
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>,
              },
              {
                step: "03",
                title: "Embed & go live",
                desc: "Copy one script tag, paste it on your site. Your chatbot is live and answering questions instantly.",
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
              },
            ].map((item) => (
              <div key={item.step} className="bg-neutral-950 p-10 group hover:bg-white/[0.02] transition-colors duration-300 relative">
                <span className="text-[4rem] font-black text-white/[0.03] absolute top-4 right-6 leading-none select-none">{item.step}</span>
                <div className="text-primary-400 mb-5">{item.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-100 mb-3">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="relative py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-400 mb-4">Features</p>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Everything you need, nothing you don&apos;t</h2>
            <p className="text-neutral-500 max-w-lg mx-auto">A complete platform for deploying, managing, and scaling AI-powered support chatbots.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Knowledge Base", desc: "Upload PDFs, documents, and text. Your chatbot learns from your content instantly.", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
              { title: "Smart AI Responses", desc: "Powered by advanced LLMs that understand context, handle follow-ups, and cite your sources.", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg> },
              { title: "Embeddable Widget", desc: "One script tag adds a fully-featured chat widget to any website. Light and dark themes included.", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg> },
              { title: "User Analytics", desc: "Track conversations, messages, and user engagement. See who is using your chatbot and how.", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
              { title: "Custom Branding", desc: "Your logo, your colors, your domain. White-label your chatbot to match your brand identity.", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125V7.5M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072" /></svg> },
              { title: "Multi-tenant", desc: "Each company gets isolated data, users, and settings. Built for SaaS from the ground up.", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg> },
            ].map((feature) => (
              <div key={feature.title} className="group border border-white/[0.06] rounded-xl p-6 hover:border-primary-500/20 hover:bg-white/[0.015] transition-all duration-300">
                <div className="text-primary-400 mb-4 group-hover:text-primary-300 transition-colors">{feature.icon}</div>
                <h3 className="text-base font-semibold text-neutral-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="relative py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "<200ms", label: "Response time" },
              { value: "10K+", label: "Messages / day" },
              { value: "50+", label: "Integrations" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== EMBED CODE PREVIEW ====== */}
      <section className="relative py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-400 mb-4">Integration</p>
              <h2 className="text-4xl font-bold tracking-tight mb-4">One line of code</h2>
              <p className="text-neutral-500 leading-relaxed mb-8 max-w-md">
                Add your chatbot to any website — WordPress, Shopify, React, static HTML — with a single script tag. It just works.
              </p>
              <ul className="space-y-3 text-sm text-neutral-400">
                {["Loads asynchronously — zero performance impact", "Fully responsive across all devices", "Light and dark theme auto-detection", "GDPR-friendly with no third-party cookies"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 font-mono text-sm text-neutral-400 leading-relaxed overflow-x-auto">
                <div className="flex items-center gap-2 mb-4 text-xs text-neutral-600">
                  <span className="w-3 h-3 rounded-full bg-red-500/30" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
                  <span className="w-3 h-3 rounded-full bg-green-500/30" />
                  <span className="ml-2">index.html</span>
                </div>
                <pre className="whitespace-pre-wrap">
{`<`}<span className="text-primary-300">script</span>{`
  `}<span className="text-accent-300">src</span>=<span className="text-amber-300">&quot;https://api.chatelio.com/embed.js&quot;</span>{`
  `}<span className="text-accent-300">data-company-slug</span>=<span className="text-amber-300">&quot;your-company&quot;</span>{`
  `}<span className="text-accent-300">data-primary-color</span>=<span className="text-amber-300">&quot;#4f46e5&quot;</span>{`
  `}<span className="text-accent-300">async</span>{`
>`}<span className="text-primary-300">{`</script>`}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-5">
            Ready to launch your
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">AI chatbot?</span>
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto mb-10">
            Join hundreds of teams using {APP_CONFIG.NAME} to automate support and delight their customers.
          </p>
          <Link href={ROUTES.COMPANY_REGISTER}>
            <Button size="lg" className="shadow-lg shadow-primary-600/20">
              Get started — it&apos;s free
            </Button>
          </Link>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-primary-400" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12.5C9 11.12 10.12 10 11.5 10h5c1.38 0 2.5 1.12 2.5 2.5v3c0 1.38-1.12 2.5-2.5 2.5H13l-2.5 2V18h-.5A1.5 1.5 0 019 16.5v-4z" fill="currentColor" opacity="0.7"/>
            </svg>
            <span className="text-sm text-neutral-500">{APP_CONFIG.NAME}</span>
          </div>
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
