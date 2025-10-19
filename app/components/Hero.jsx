"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center gap-10">
        
        {/* Text Content */}
        <div className="flex-1 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight"
          >
            Procastinate AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-100"
          >
            Scan news, social media, and global events in real-time. Verify claims and fight misinformation with AI-powered analytics.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <a
              href="#ClaimVerifier"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Start Verifying
            </a>
          </motion.div>
        </div>

        {/* Image / Illustration */}
        <div className="flex-1">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            src="/assets/ai-img.jpeg" // replace with your own AI illustration
            alt="AI Analysis Illustration"
            className="w-full max-w-lg mx-auto"
          />
        </div>
      </div>

      {/* Optional Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-spin-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>
    </section>
  );
}
