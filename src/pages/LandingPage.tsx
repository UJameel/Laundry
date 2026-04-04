import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Wallet,
  FileText,
  Sparkles,
  BarChart3,
  Zap,
  Mic,
  Shield,
  Brain,
  Link2,
  FlaskConical,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const LOOM_URL =
  "https://www.loom.com/share/bee003d9f3be4788ba05724e7a8b6ea1";

function useCountUp(end: number, duration = 1800, startOnView = true) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView || !inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      setValue(Math.round(eased * end));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration, startOnView]);

  return { ref, value };
}

/* fade-in-up variant factory */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] },
  },
});

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Section wrapper with inView animation                              */
/* ------------------------------------------------------------------ */

function AnimatedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Spinning drum logo (shared with Navbar)                            */
/* ------------------------------------------------------------------ */

function DrumLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center rounded-full"
        style={{
          border: "2px solid #0d9488",
          background: "linear-gradient(180deg, #14B8A6, #0d9488)",
          boxShadow: "0 2px 8px rgba(20, 184, 166, 0.25)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {[0, 60, 120].map((deg) => (
          <div
            key={deg}
            className="absolute h-full w-[1px]"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              transform: `rotate(${deg}deg)`,
            }}
          />
        ))}
        <div className="absolute inset-[3px] rounded-full bg-white border border-white/30" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/50 top-1 left-1" />
      </motion.div>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold font-mono pointer-events-none"
        style={{ fontSize: size * 0.34, color: "rgba(20, 184, 166, 0.7)" }}
      >
        $
      </span>
    </div>
  );
}

/* ================================================================== */
/*  LANDING PAGE                                                       */
/* ================================================================== */

const LandingPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* count-up values */
  const savings = useCountUp(10905, 2000);
  const traditional = useCountUp(14050, 2000);
  const laundry = useCountUp(3145, 2000);

  return (
    <div className="grain ambient-bg min-h-screen">
      {/* ============================================================ */}
      {/*  NAVIGATION                                                   */}
      {/* ============================================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <DrumLogo />
            <span className="text-[15px] font-bold tracking-tight text-white font-display">
              Laundry
            </span>
          </div>

          {/* Center links — desktop */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: "How It Works", id: "how-it-works" },
              { label: "Features", id: "features" },
              { label: "Security", id: "security" },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-[13px] font-medium text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] rounded"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={LOOM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-white/60 hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] rounded"
            >
              Watch Demo
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              to="/wallets"
              className="btn-brand px-5 py-2 rounded-full text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            >
              Launch App
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 right-0 border-t border-white/10"
            style={{ background: "#0F172A" }}
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-2">
              {[
                { label: "How It Works", id: "how-it-works" },
                { label: "Features", id: "features" },
                { label: "Security", id: "security" },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="px-4 py-2.5 rounded-lg text-[13px] font-medium text-left text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <a
                href={LOOM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-lg text-[13px] font-medium text-left text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                Watch Demo
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                to="/wallets"
                className="btn-brand px-5 py-2.5 rounded-full text-[13px] text-center mt-1"
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-0">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left — 3 cols */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-semibold tracking-wide mb-6"
                style={{
                  background: "rgba(20, 184, 166, 0.08)",
                  color: "#14B8A6",
                  border: "1px solid rgba(20, 184, 166, 0.2)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Treasury Optimization
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-[-0.03em]"
                style={{ color: "#0F172A" }}
              >
                Clean Your
                <br />
                Cross-Border
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #1E3A8A 30%, #14B8A6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Payments
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.25,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="mt-6 text-[16px] leading-[1.7] max-w-lg"
                style={{ color: "#334155" }}
              >
                Route international payments through USDC stablecoins. AI
                analyzes your batch, finds the cheapest path for each invoice,
                runs compliance checks, and executes — saving up to 78% on FX
                fees.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link
                  to="/wallets"
                  className="btn-brand px-7 py-3 rounded-xl text-[14px] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2"
                >
                  Start a Wash
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <a
                  href={LOOM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost px-7 py-3 rounded-xl text-[14px] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2"
                >
                  Watch Demo
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            </div>

            {/* Right — 2 cols: savings display */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <div className="relative">
                {/* Teal glow behind */}
                <div
                  className="absolute -inset-6 rounded-3xl opacity-30 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(20, 184, 166, 0.3), transparent 70%)",
                  }}
                />
                <div className="relative glass-card-elevated rounded-2xl p-8 lg:p-10">
                  <p
                    className="text-[13px] font-semibold tracking-wide uppercase mb-2"
                    style={{ color: "#14B8A6" }}
                  >
                    Total Savings
                  </p>
                  <p
                    ref={savings.ref}
                    className="text-5xl sm:text-6xl lg:text-[68px] font-extrabold tracking-[-0.03em] leading-none"
                    style={{ color: "#0F172A" }}
                  >
                    ${savings.value.toLocaleString()}
                  </p>
                  <p
                    className="text-[14px] mt-2 mb-8"
                    style={{ color: "#64748B" }}
                  >
                    Saved on a $314,500 batch
                  </p>

                  {/* Comparison mini-card */}
                  <div
                    className="rounded-xl p-5"
                    style={{
                      background: "rgba(20, 184, 166, 0.04)",
                      border: "1px solid rgba(20, 184, 166, 0.12)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: "#64748B" }}
                      >
                        Traditional Banks
                      </span>
                      <span
                        ref={traditional.ref}
                        className="text-[16px] font-semibold line-through"
                        style={{ color: "#94A3B8" }}
                      >
                        ${traditional.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: "#14B8A6" }}
                      >
                        Laundry
                      </span>
                      <span
                        ref={laundry.ref}
                        className="text-[20px] font-bold"
                        style={{ color: "#14B8A6" }}
                      >
                        ${laundry.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <AnimatedSection
        id="how-it-works"
        className="py-24 lg:py-32 relative z-10"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp()} className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em]"
              style={{ color: "#0F172A" }}
            >
              The Wash Cycle
            </h2>
            <p
              className="mt-3 text-[16px]"
              style={{ color: "#64748B" }}
            >
              Six steps from invoice to settlement
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                icon: Wallet,
                title: "Wallets",
                desc: "Configure sender & recipient wallets on Base testnet",
              },
              {
                num: "02",
                icon: FileText,
                title: "Load",
                desc: "Upload your invoice batch — 7 corridors, $314,500 total",
              },
              {
                num: "03",
                icon: Sparkles,
                title: "Wash",
                desc: "AI analyzes routes, compares bank vs stablecoin costs",
              },
              {
                num: "04",
                icon: BarChart3,
                title: "Spin",
                desc: "Review optimized plan with per-invoice savings",
              },
              {
                num: "05",
                icon: Zap,
                title: "Rinse",
                desc: "Execute USDC transfers via Crossmint wallets",
              },
              {
                num: "06",
                icon: Mic,
                title: "Briefing",
                desc: "AI voice summary of your treasury optimization",
              },
            ].map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp()}
                className="glass-card hover-glow rounded-xl p-6 flex flex-col gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-md"
                    style={{
                      background: "rgba(20, 184, 166, 0.1)",
                      color: "#14B8A6",
                    }}
                  >
                    {step.num}
                  </span>
                  <step.icon
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    style={{ color: "#1E3A8A" }}
                  />
                </div>
                <h3
                  className="text-[16px] font-bold"
                  style={{ color: "#0F172A" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.6]"
                  style={{ color: "#64748B" }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/*  STATS — dark band                                            */}
      {/* ============================================================ */}
      <AnimatedSection
        id="features"
        className="py-24 lg:py-32 relative z-10"
        key="stats"
      >
        <div
          className="absolute inset-0"
          style={{ background: "#0F172A" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp()} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white">
              Built for Treasury Teams
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                stat: "7",
                label: "Payment Corridors",
                desc: "AR, DE, NG, GB, JP, TR, VG",
              },
              {
                stat: "1:1",
                label: "USDC Conversion",
                desc: "Stablecoin-backed, zero slippage",
              },
              {
                stat: "$10,905",
                label: "Avg. Batch Savings",
                desc: "78% reduction vs traditional banks",
              },
              {
                stat: "AI",
                label: "Compliance Screening",
                desc: "OFAC, FATF, UN/EU sanctions lists",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp()}
                className="rounded-xl p-6 text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <p
                  className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] mb-2"
                  style={{ color: "#14B8A6" }}
                >
                  {item.stat}
                </p>
                <p className="text-[14px] font-semibold text-white mb-1">
                  {item.label}
                </p>
                <p className="text-[13px] text-white/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/*  COMPARISON TABLE                                             */}
      {/* ============================================================ */}
      <AnimatedSection className="py-24 lg:py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp()} className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em]"
              style={{ color: "#0F172A" }}
            >
              How We're Different
            </h2>
          </motion.div>

          {/* Desktop table */}
          <motion.div
            variants={fadeUp(0.1)}
            className="hidden md:block glass-card-elevated rounded-2xl overflow-hidden"
          >
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">
                    &nbsp;
                  </th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">
                    Traditional Banks
                  </th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">
                    Fintech (Wise, etc.)
                  </th>
                  <th
                    className="px-6 py-4 text-[13px] font-bold"
                    style={{
                      color: "#14B8A6",
                      borderLeft: "3px solid #14B8A6",
                      background: "rgba(20, 184, 166, 0.04)",
                    }}
                  >
                    Laundry
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    row: "Approach",
                    bank: "Correspondent banking, SWIFT",
                    fintech: "Multi-rail aggregation",
                    laundry: "Stablecoin-optimized routing",
                  },
                  {
                    row: "Unit of Optimization",
                    bank: "Single transfer",
                    fintech: "Single transfer",
                    laundry: "Entire invoice batch",
                  },
                  {
                    row: "Intelligence",
                    bank: "Manual selection",
                    fintech: "Rule-based routing",
                    laundry: "AI per-invoice optimization",
                  },
                  {
                    row: "Stablecoin Usage",
                    bank: "None",
                    fintech: "Rare / limited",
                    laundry: "USDC on Base (primary rail)",
                  },
                  {
                    row: "Target User",
                    bank: "Enterprise treasury",
                    fintech: "SMBs & individuals",
                    laundry: "Treasury teams seeking alpha",
                  },
                ].map((r, i) => (
                  <tr
                    key={r.row}
                    style={{
                      borderBottom:
                        i < 4 ? "1px solid #E2E8F0" : undefined,
                    }}
                  >
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#0F172A]">
                      {r.row}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#64748B]">
                      {r.bank}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#64748B]">
                      {r.fintech}
                    </td>
                    <td
                      className="px-6 py-4 text-[13px] font-medium"
                      style={{
                        color: "#0F172A",
                        borderLeft: "3px solid #14B8A6",
                        background: "rgba(20, 184, 166, 0.04)",
                      }}
                    >
                      {r.laundry}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Mobile stacked cards */}
          <div className="md:hidden flex flex-col gap-4">
            {[
              {
                row: "Approach",
                bank: "Correspondent banking, SWIFT",
                fintech: "Multi-rail aggregation",
                laundry: "Stablecoin-optimized routing",
              },
              {
                row: "Unit of Optimization",
                bank: "Single transfer",
                fintech: "Single transfer",
                laundry: "Entire invoice batch",
              },
              {
                row: "Intelligence",
                bank: "Manual selection",
                fintech: "Rule-based routing",
                laundry: "AI per-invoice optimization",
              },
              {
                row: "Stablecoin Usage",
                bank: "None",
                fintech: "Rare / limited",
                laundry: "USDC on Base (primary rail)",
              },
              {
                row: "Target User",
                bank: "Enterprise treasury",
                fintech: "SMBs & individuals",
                laundry: "Treasury teams seeking alpha",
              },
            ].map((r) => (
              <motion.div
                key={r.row}
                variants={fadeUp()}
                className="glass-card rounded-xl p-5"
              >
                <p
                  className="text-[13px] font-bold mb-3"
                  style={{ color: "#0F172A" }}
                >
                  {r.row}
                </p>
                <div className="flex flex-col gap-2.5">
                  <div className="text-[12px]">
                    <span className="block font-medium mb-0.5" style={{ color: "#94A3B8" }}>Banks</span>
                    <span style={{ color: "#64748B" }}>{r.bank}</span>
                  </div>
                  <div className="text-[12px]">
                    <span className="block font-medium mb-0.5" style={{ color: "#94A3B8" }}>Fintech</span>
                    <span style={{ color: "#64748B" }}>{r.fintech}</span>
                  </div>
                  <div
                    className="text-[12px] font-semibold rounded-lg px-3 py-2.5 mt-0.5"
                    style={{
                      color: "#14B8A6",
                      background: "rgba(20, 184, 166, 0.06)",
                      border: "1px solid rgba(20, 184, 166, 0.15)",
                    }}
                  >
                    <span className="block text-[11px] font-medium mb-0.5" style={{ color: "#0d9488" }}>Laundry</span>
                    <span>{r.laundry}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/*  SECURITY                                                     */}
      {/* ============================================================ */}
      <AnimatedSection
        id="security"
        className="py-24 lg:py-32 relative z-10"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp()} className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em]"
              style={{ color: "#0F172A" }}
            >
              Enterprise-Grade Security
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Shield,
                title: "Crossmint Wallets",
                desc: "Institutional-grade wallet infrastructure for secure USDC custody and transfers.",
              },
              {
                icon: Brain,
                title: "AI Sanctions Screening",
                desc: "MiniMax LLM checks every recipient against OFAC, FATF, UN, and EU sanctions lists.",
              },
              {
                icon: Link2,
                title: "On-Chain Settlement",
                desc: "Every transfer verified on Base (Ethereum L2) with full transaction transparency.",
              },
              {
                icon: FlaskConical,
                title: "Testnet Mode",
                desc: "Currently running on Base testnet — no real funds at risk. Safe to explore and demo.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp()}
                className="glass-card hover-glow rounded-xl p-6 flex gap-5"
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(30, 58, 138, 0.06)",
                    border: "1px solid rgba(30, 58, 138, 0.1)",
                  }}
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: "#1E3A8A" }}
                  />
                </div>
                <div>
                  <h3
                    className="text-[15px] font-bold mb-1"
                    style={{ color: "#0F172A" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.6]"
                    style={{ color: "#64748B" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/*  CTA                                                          */}
      {/* ============================================================ */}
      <AnimatedSection className="py-24 lg:py-32 relative z-10">
        <div
          className="absolute inset-0"
          style={{ background: "#0F172A" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.h2
            variants={fadeUp()}
            className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white"
          >
            Ready to clean your payments?
          </motion.h2>
          <motion.p
            variants={fadeUp(0.1)}
            className="mt-4 text-[16px] text-white/60 max-w-md mx-auto"
          >
            Start with our demo batch — $314,500 across 7 corridors.
          </motion.p>
          <motion.div variants={fadeUp(0.2)} className="mt-8">
            <Link
              to="/wallets"
              className="btn-brand px-8 py-3.5 rounded-xl text-[15px] inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            >
              Launch the Demo
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <footer
        className="relative z-10 py-12"
        style={{
          background: "#0F172A",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Left */}
            <div className="flex items-center gap-3">
              <DrumLogo size={28} />
              <div>
                <p className="text-[14px] font-bold text-white">
                  Laundry
                </p>
                <p className="text-[12px] text-white/40">
                  Clean Your Cross-Border Payments
                </p>
              </div>
            </div>

            {/* Center links */}
            <div className="flex flex-wrap gap-6">
              {[
                { label: "How It Works", id: "how-it-works" },
                { label: "Features", id: "features" },
                { label: "Security", id: "security" },
                { label: "Demo", href: LOOM_URL },
              ].map((l) =>
                "href" in l ? (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-white/50 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                ) : (
                  <button
                    key={l.label}
                    onClick={() => scrollTo(l.id!)}
                    className="text-[13px] text-white/50 hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                )
              )}
            </div>

            {/* Right */}
            <p className="text-[12px] text-white/30">
              Built at Vibe-Coding HACathon 2026
            </p>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-[11px] text-white/25 text-center">
            Testnet only — no real funds. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
