// app/api/verify/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text: statement } = await req.json();

    if (!statement || statement.trim() === "") {
      return NextResponse.json({ ok: false, error: "Empty statement" });
    }

    // Ensure environment variables exist
    const API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = process.env.GEMINI_MODEL || "gemini-1.5";

    if (!API_KEY) {
      return NextResponse.json({ ok: false, error: "Missing GEMINI_API_KEY" });
    }

    // Gemini Pro API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateText`;

    // Minimal prompt to save tokens
    const prompt = `You are a fact verification AI. Verify this statement: "${statement}". 
    Respond clearly with either ✅ True, ❌ False, or ⚠️ Uncertain. 
    Provide one sentence explanation if possible.`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        maxOutputTokens: 150,
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini API error:", res.status, text);
      return NextResponse.json({ ok: false, error: `Gemini API returned ${res.status}` });
    }

    const data = await res.json();
    const resultText = data?.candidates?.[0]?.content || "⚠️ Could not verify";

    return NextResponse.json({ ok: true, result: resultText });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ ok: false, error: "Error verifying statement." });
  }
}
