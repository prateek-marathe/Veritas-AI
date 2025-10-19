import { Brain, LineChart, Shield } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-blue-400" />,
    title: "Smart Insights",
    desc: "AI-powered analytics that understand your data instantly.",
  },
  {
    icon: <LineChart className="w-8 h-8 text-blue-400" />,
    title: "Real-Time Reports",
    desc: "Track performance and trends with interactive dashboards.",
  },
  {
    icon: <Shield className="w-8 h-8 text-blue-400" />,
    title: "Enterprise Security",
    desc: "Your data is encrypted, secured, and always under your control.",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 bg-black/40 backdrop-blur-md">
      <h2 className="text-center text-4xl font-semibold mb-12">Key Features</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="p-8 bg-gray-900/60 rounded-2xl shadow-lg text-center border border-gray-800 hover:border-blue-500 transition-all">
            <div className="flex justify-center mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
