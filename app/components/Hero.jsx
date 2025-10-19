"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
      >
        Veritas AI
      </motion.h1>
      <p className="mt-6 text-lg text-gray-300 max-w-xl">
        Empowering businesses with next-gen AI analysis and automation.
      </p>
      <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all">
        Get Started
      </button>
    </section>
  );
}
