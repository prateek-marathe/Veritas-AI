import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text: statement } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in .env.local");
    }

    const model = process.env.GEMINI_MODEL || "gemini-1.5";
    const prompt = `You are a fact verification AI. Verify the following statement and respond clearly with either ✅ True, ❌ False, or ⚠️ Uncertain. Statement: "${statement}"`;

    const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateText?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: prompt,
      temperature: 0,
      max_output_tokens: 150
    }),
  }
);

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini API error:", res.status, text);
      throw new Error(`Gemini API returned ${res.status}`);
    }

    const data = await res.json();
    const result = data?.candidates?.[0]?.content?.[0]?.text || "⚠️ Could not verify";

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ ok: false, error: err.message });
  }
}
