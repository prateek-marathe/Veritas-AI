import { NextResponse } from "next/server";

const localFacts = {
  "prime minister of india": "Narendra Modi",
  "capital of france": "Paris",
  "sun rises in the east": "True",
  "moon is not made of cheese": "True",
  "water boils at 100 degrees celsius": "True",
};

export async function POST(req) {
  try {
    const { text } = await req.json();
    const input = text.trim().toLowerCase();

    // --- Tier 1: Local Facts ---
    for (const key in localFacts) {
      if (input.includes(key)) {
        return NextResponse.json({
          result: `✅ True / ${localFacts[key]}`,
          sources: ["Local Fact Database"],
        });
      }
    }

    // --- Tier 2: DuckDuckGo Instant Answer ---
    try {
      const ddgRes = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(input)}&format=json&no_redirect=1&no_html=1`
      );
      const ddgData = await ddgRes.json();
      if (ddgData.Abstract || ddgData.Answer) {
        return NextResponse.json({
          result: `✅ True / ${ddgData.Abstract || ddgData.Answer}`,
          sources: ["DuckDuckGo Instant Answer"],
        });
      }
    } catch (e) {
      console.error("DuckDuckGo error:", e);
    }

    // --- Tier 3: AI Fallback ---
    // Aggregate RSS feeds
    const rssFeeds = [
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://www.aljazeera.com/xml/rss/all.xml",
      "https://www.reutersagency.com/feed/?best-topics=world",
    ];
    let contextTexts = [];

    for (const feedUrl of rssFeeds) {
      try {
        const url = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const res = await fetch(url);
        const data = await res.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const items = Array.from(xml.querySelectorAll("item")).slice(0, 5);
        items.forEach((item) => {
          const title = item.querySelector("title")?.textContent || "";
          const desc = item.querySelector("description")?.textContent || "";
          contextTexts.push(`${title}. ${desc}`);
        });
      } catch {}
    }

    const finalContext = contextTexts.join(" ").trim();

    if (!finalContext) {
      return NextResponse.json({
        result: "⚠️ Uncertain / Needs more evidence (no context found)",
        sources: [],
      });
    }

    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/s-nlp/roberta-base-snli-mnli",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: { premise: finalContext, hypothesis: text },
        }),
      }
    );
    const hfData = await hfRes.json();
    const label =
      hfData?.[0]?.label === "ENTAILMENT"
        ? "✅ True"
        : hfData?.[0]?.label === "CONTRADICTION"
        ? "❌ False"
        : "⚠️ Uncertain / Needs more evidence";

    return NextResponse.json({
      result: label,
      sources: ["Aggregated RSS + AI Fallback"],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ result: "Error verifying statement." });
  }
}
