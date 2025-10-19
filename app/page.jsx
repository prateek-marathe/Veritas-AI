import Hero from "./components/Hero";
import Features from "./components/Features";
import Verifier from "./components/ClaimVerifier";
import EmergingNews from "./components/EmergingNews";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Verifier />  {/* 👈 Added AI Agent section */}
      <EmergingNews />
    </>
  );
}
