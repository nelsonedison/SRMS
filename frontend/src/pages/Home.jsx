import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Users, Clock, Shield, Workflow, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-slate-800">
      {/* ================= Hero Section ================= */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-extrabold text-indigo-800 leading-tight mb-6"
        >
          Student Request Management System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl text-lg text-slate-600 mb-8"
        >
          A centralized digital platform to streamline and track student requests —
          from submission to final approval by institutional authorities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex gap-4"
        >
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg shadow-lg transition flex items-center gap-2"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <a
            href="#features"
            className="px-6 py-3 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold rounded-lg shadow-sm transition"
          >
            Learn More
          </a>
        </motion.div>

        <motion.img
          src="https://cdn.dribbble.com/users/241599/screenshots/17398868/media/b8c4d87e080b0162333e22d259c2cb6f.png?resize=1000x600"
          alt="Dashboard Preview"
          className="w-full max-w-5xl mt-16 rounded-2xl shadow-2xl border border-indigo-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />
      </section>

      {/* ================= Features Section ================= */}
      <section id="features" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-indigo-800 mb-4"
          >
            Key Features
          </motion.h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
            Simplifying the request process across multiple levels — ensuring
            transparency, speed, and accountability for every student request.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: Layers,
                title: "Step-by-Step Approval Flow",
                desc: "Requests move sequentially from Tutor → HoD → Principal, ensuring structured decision-making.",
              },
              {
                icon: Users,
                title: "Role-Based Access",
                desc: "Different dashboards for Students, Tutors, HoDs, and Principals, each with role-specific actions.",
              },
              {
                icon: Clock,
                title: "Real-Time Tracking",
                desc: "Students can track the live status of their requests with timestamps at each stage.",
              },
              {
                icon: Shield,
                title: "Secure Authentication",
                desc: "Only pre-registered users from the institutional database can access the system.",
              },
              {
                icon: Workflow,
                title: "Smart Workflow Automation",
                desc: "Automated forwarding of requests after approval to the next authority for efficiency.",
              },
              {
                icon: CheckCircle2,
                title: "Transparency & Audit Logs",
                desc: "Every action is logged — providing a clear record of approvals, rejections, and comments.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
                className="bg-indigo-50 hover:bg-indigo-100 transition p-6 rounded-xl shadow-sm border border-indigo-100"
              >
                <f.icon className="text-indigo-700 mb-4" size={36} />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= About Section ================= */}
      <section id="about" className="py-24 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-6 text-center"
          >
            About the Project
          </motion.h2>

          <div className="max-w-4xl mx-auto text-center space-y-6 text-lg leading-relaxed">
            <p>
              The Unified Student Request Management System is designed to digitize and
              streamline the process of submitting, reviewing, and approving student
              requests in educational institutions.
            </p>
            <p>
              Traditionally, these requests are handled manually through paper-based forms
              or email threads, leading to inefficiency, delays, and lack of transparency.
              Our platform addresses this by providing a single digital interface for all
              stakeholders.
            </p>
            <p>
              It ensures accountability by maintaining a structured approval workflow and
              enabling authorities at each level to view, approve, reject, or comment on
              requests efficiently — enhancing communication and institutional governance.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Footer ================= */}
      <footer className="py-10 bg-slate-900 text-slate-400 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Unified Student Request Management System. All Rights Reserved.
        </p>
        <p className="mt-1">Developed with ❤️ for institutional efficiency and transparency.</p>
      </footer>
    </div>
  );
}
