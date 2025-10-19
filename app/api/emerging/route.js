"use client";
import { useEffect, useState } from "react";

const FEEDS = [
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://www.aljazeera.com/xml/rss/all.xml"
];

export default function EmergingNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Try to load cached verified results (sessionStorage)
  useEffect(() => {
    const cached = sessionStorage.getItem("emergingArticles");
    if (cached) {
      setArticles(JSON.parse(cached));
      setLoading(false);
      return;
    }

    (async () => {
      try {
        let items = [];
        for (const feed of FEEDS) {
          const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed)}`);
          const d = await r.json();
          const parser = new DOMParser();
          const xml = parser.parseFromString(d.contents, "application/xml");
          const nodes = Array.from(xml.querySelectorAll("item")).slice(0, 6);
          nodes.forEach((n) => {
            const title = n.querySelector("title")?.textContent || "";
            const link = n.querySelector("link")?.textContent || "";
            const enclosure = n.querySelector("enclosure");
            const image = enclosure?.getAttribute("url") || null;
            items.push({ title, link, image, verdict: null });
          });
        }
        // dedupe by title
        const unique = Array.from(new Map(items.map(i => [i.title, i])).values()).slice(0, 12);
        setArticles(unique);
        sessionStorage.setItem("emergingArticles", JSON.stringify(unique)); // save raw list (no verdicts)
      } catch (err) {
        console.error("fetch rss error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const verifyArticle = async (index) => {
    const articlesCopy = [...articles];
    const a = articlesCopy[index];
    if (!a || a.verdict) return; // already verified

    // optimistic update
    articlesCopy[index] = { ...a, verdict: "Verifying..." };
    setArticles(articlesCopy);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: a.title }),
      });
      const data = await res.json();
      const verdict = data?.ok ? data.result : (data?.error || "⚠️ Error");
      articlesCopy[index] = { ...a, verdict };
      setArticles(articlesCopy);

      // persist verdicts in sessionStorage (so refresh won't call API again)
      sessionStorage.setItem("emergingArticles", JSON.stringify(articlesCopy));
    } catch (err) {
      console.error("verify article error", err);
      articlesCopy[index] = { ...a, verdict: "⚠️ Error verifying" };
      setArticles(articlesCopy);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 text-white">
      <h2 className="text-3xl font-bold mb-6">Emerging News — Verify on demand</h2>

      {loading ? <p className="text-gray-300">Loading headlines…</p> : (
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((a, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg flex gap-4">
              {a.image ? (
                <img src={a.image} alt={a.title} className="w-28 h-20 object-cover rounded" />
              ) : (
                <div className="w-28 h-20 bg-gray-800 rounded flex items-center justify-center text-sm">No image</div>
              )}
              <div className="flex-1">
                <a href={a.link} target="_blank" className="font-semibold hover:underline">{a.title}</a>
                <div className="mt-2">
                  <button
                    onClick={() => verifyArticle(i)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm"
                    disabled={!!a.verdict && a.verdict !== "Verifying..."}
                  >
                    {a.verdict ? (a.verdict === "Verifying..." ? "Verifying..." : "Verified") : "Verify"}
                  </button>
                </div>
                {a.verdict && <div className="mt-2 text-sm">{a.verdict}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
