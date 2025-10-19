"use client";
import { useState } from "react";

export default function ClaimVerifier() {
  const [statement, setStatement] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyStatement = async () => {
    if (!statement.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: statement }),
      });
      const data = await res.json();
      setResult(data?.ok ? data.result : `⚠️ ${data?.error || "Error"}`);
    } catch (err) {
      setResult("⚠️ Error verifying statement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 text-white" id="ClaimVerifier">
      <h2 className="text-3xl font-bold mb-4">Claim Verifier</h2>
      <textarea
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        placeholder="Enter your statement here..."
        className="w-full p-3 rounded-lg bg-gray-800 text-white"
        rows={3}
      />
      <div className="mt-4 flex gap-2">
        <button
          onClick={verifyStatement}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Check Authenticity"}
        </button>
        {result && (
          <button
            onClick={() =>
              window.open(`https://www.google.com/search?q=${encodeURIComponent(statement)}`, "_blank")
            }
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Search on Web
          </button>
        )}
      </div>
      {result && <p className="mt-4 text-lg">{result}</p>}
    </div>
  );
}
