"use client";
import { useEffect, useState } from "react";

export default function EmergingNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const feeds = [
          "https://feeds.bbci.co.uk/news/world/rss.xml",
          "https://www.aljazeera.com/xml/rss/all.xml",
          "https://www.reutersagency.com/feed/?best-topics=world",
        ];

        let allItems = [];

        for (const feedUrl of feeds) {
          const url = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
          const res = await fetch(url);
          const data = await res.json();

          const parser = new DOMParser();
          const xml = parser.parseFromString(data.contents, "text/xml");
          const items = Array.from(xml.querySelectorAll("item")).slice(0, 5);

          allItems.push(...items);
        }

        const articlesWithVerification = await Promise.all(
          allItems.map(async (item) => {
            const title = item.querySelector("title")?.textContent;
            const link = item.querySelector("link")?.textContent;

            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: title }),
            });
            const verifyData = await verifyRes.json();

            return { title, link, verdict: verifyData.result, sources: verifyData.sources };
          })
        );

        // Calculate trust score
        const trueCount = articlesWithVerification.filter(a => a.verdict.includes("True")).length;
        const score = Math.round((trueCount / articlesWithVerification.length) * 100);

        setTrustScore(score);
        setArticles(articlesWithVerification);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-12 text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        📰 Emerging News & AI Verification
      </h2>

      <p className="text-center mb-6 text-lg">
        Trust Score: <span className="font-bold text-blue-400">{trustScore}/100</span>
      </p>

      {loading ? (
        <p className="text-center text-gray-400">Loading latest headlines...</p>
      ) : (
        <div className="space-y-4">
          {articles.map((article, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-xl backdrop-blur-lg flex justify-between items-center"
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {article.title}
              </a>

              <span
                className={`text-sm font-semibold ${
                  article.verdict.includes("True")
                    ? "text-green-400"
                    : article.verdict.includes("False")
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {article.verdict} ({article.sources?.join(", ")})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
