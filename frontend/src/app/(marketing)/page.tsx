"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Shield, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

export default function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl"
      >
        <div className="flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="font-bold text-sm">H</span>
            </div>
            <span className="font-semibold tracking-tight text-white/90">HotelFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden md:block text-sm font-medium text-white/70 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-white/80">Hotel Management Reimagined</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-6">
            Run your hotel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 italic font-serif">effortlessly.</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
            The ultimate management system for modern hotels. Handle bookings, staff, guests, and revenue all from one beautiful, lightning-fast dashboard.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/dashboard" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform duration-300">
              Explore Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-lg transition-colors">
              Book a Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative px-6 py-20">
        <motion.div 
          ref={targetRef}
          style={{ opacity, scale }}
          className="max-w-6xl mx-auto rounded-2xl md:rounded-[2.5rem] border border-white/10 bg-white/5 p-2 md:p-4 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
          <div className="rounded-xl md:rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a0a0a]">
            {/* Mockup Topbar */}
            <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
            </div>
            {/* Mockup Image/Content Placeholder */}
            <div className="aspect-[16/9] md:aspect-[21/9] bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-blue-900/40" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Everything you need. <span className="text-white/40">Nothing you don't.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="md:col-span-2 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 p-8 flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <BarChart3 className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-white/60 mb-8 max-w-sm">Track your revenue, occupancy rates, and staff performance in real-time with stunning visual charts.</p>
              <div className="mt-auto h-48 rounded-xl border border-white/10 bg-black/50 overflow-hidden relative">
                {/* Fake Chart Lines */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between px-4 gap-2 opacity-50">
                  {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 p-8 flex flex-col"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-white/60">Built on Next.js 14, every interaction feels instant. No more waiting for pages to load.</p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 p-8 flex flex-col"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-based Auth</h3>
              <p className="text-white/60">Granular permissions for Admins, Receptionists, and Housekeeping staff.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="md:col-span-2 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 p-8 flex flex-col sm:flex-row items-center gap-8"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Smart Room Management</h3>
                <p className="text-white/60 mb-6">Automate check-ins, monitor cleaning status, and assign tasks to housekeeping seamlessly.</p>
                <ul className="space-y-3">
                  {['Drag & drop assignments', 'Instant status updates', 'Maintenance alerts'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full sm:w-1/2 aspect-square rounded-2xl border border-white/10 bg-black/50 p-4">
                {/* Mock UI snippet */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-white/5 border border-white/5 flex items-center px-4 gap-4">
                      <div className="w-10 h-10 rounded-md bg-white/10" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-1/2 bg-white/20 rounded-full" />
                        <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 pointer-events-none" />
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-6" />
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Ready to upgrade?</h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Join hundreds of modern hotels who have already switched to HotelFlow and streamlined their operations.
          </p>
          <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Start Your Free Trial
          </Link>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-white/40 text-sm">
        <p>© 2026 HotelFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
