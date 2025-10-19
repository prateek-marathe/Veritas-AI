"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Verifier() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyNews = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data.result || "Unable to verify right now.");
    } catch (err) {
      setResult("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-50" />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-2xl mx-auto p-8 backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 drop-shadow">
          🧠 AI Fake News Verifier
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter any news headline or statement..."
          className="w-full p-4 mb-4 rounded-xl border border-gray-300 bg-white/40 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows="3"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          onClick={verifyNews}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Check Authenticity"}
        </motion.button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl font-semibold text-lg shadow ${
              result.includes("True")
                ? "bg-green-100 text-green-700"
                : result.includes("Fake")
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {result}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
