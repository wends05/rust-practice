import { useGSAP } from "@gsap/react";
import { ArrowsClockwiseIcon, PlusIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import useReducedMotion from "../hooks/use-reduced-motion";
import { randomQuoteOptions } from "../query-options";
import AddQuoteModal from "./add-quote-modal";
import LeafIcon from "./leaf-icon";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const { data, isLoading, error, refetch } = useQuery(randomQuoteOptions);
  const reduced = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const shuffleRef = useRef<HTMLButtonElement>(null);

  // Page load entrance animation
  useGSAP(
    () => {
      if (reduced || !pageRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from("header", { autoAlpha: 0, duration: 0.5 })
        .from(".leaf-container", { autoAlpha: 0, y: 10, rotation: -5, duration: 0.6 }, "-=0.3")
        .from(".quote-block", { autoAlpha: 0, y: 20, duration: 0.8 }, "-=0.4")
        .from(".author-line", { autoAlpha: 0, scaleX: 0.8, duration: 0.5 }, "-=0.5")
        .from(".shuffle-btn", { autoAlpha: 0, y: 10, duration: 0.4 }, "-=0.3")
        .from(".add-quote-btn", { autoAlpha: 0, y: 15, duration: 0.5 }, "-=0.3")
        .from("footer", { autoAlpha: 0, duration: 0.4 }, "-=0.3");
    },
    { scope: pageRef, dependencies: [reduced] },
  );

  // Shuffle transition handler
  const handleShuffle = useCallback(async () => {
    if (isShuffling || !quoteRef.current) return;
    setIsShuffling(true);

    // Fade out
    await gsap.to(quoteRef.current, {
      autoAlpha: 0,
      y: -15,
      duration: 0.3,
      ease: "power2.in",
    });

    // Fetch new quote
    await refetch();

    // Fade in
    gsap.fromTo(
      quoteRef.current,
      { autoAlpha: 0, y: 15 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
    );

    setIsShuffling(false);
  }, [isShuffling, refetch]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (e.key === " " && !e.repeat) {
        e.preventDefault();
        handleShuffle();
      }
    },
    [isModalOpen, handleShuffle],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Shuffle button hover animation
  const handleShuffleHover = useCallback(() => {
    if (reduced || !shuffleRef.current || isShuffling) return;
    gsap.to(shuffleRef.current, { scale: 1.05, duration: 0.2, ease: "power2.out" });
  }, [reduced, isShuffling]);

  const handleShuffleLeave = useCallback(() => {
    if (reduced || !shuffleRef.current) return;
    gsap.to(shuffleRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
  }, [reduced]);

  return (
    <div ref={pageRef} className="min-h-screen bg-cream text-forest flex flex-col">
      {/* Header */}
      <header className="px-6 py-5">
        <h1 className="text-sm font-medium tracking-wide text-forest uppercase">Quotes</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Leaf icon */}
          <div className="flex justify-center leaf-container">
            <LeafIcon />
          </div>

          {/* Quote */}
          <div ref={quoteRef} className="relative min-h-50 flex items-center justify-center">
            {isLoading && !data ? (
              <div className="animate-pulse-soft">
                <p className="text-stone font-serif text-lg italic">Gathering wisdom...</p>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <p className="text-red-600/70 font-sans text-sm">{error.message}</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="text-stone text-sm hover:text-forest transition-colors underline"
                >
                  Try again
                </button>
              </div>
            ) : data ? (
              <div className="space-y-6">
                <blockquote className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight italic text-forest quote-block">
                  <span className="text-stone/40">"</span>
                  {data.text}
                  <span className="text-stone/40">"</span>
                </blockquote>
                <div className="flex items-center justify-center gap-3 author-line">
                  <span className="h-px w-8 bg-stone/30" />
                  <figcaption className="font-sans text-sm text-stone tracking-wide">
                    {data.author}
                  </figcaption>
                  <span className="h-px w-8 bg-stone/30" />
                </div>
              </div>
            ) : null}
          </div>

          {/* Shuffle button */}
          <div className="flex justify-center">
            <button
              ref={shuffleRef}
              type="button"
              onClick={handleShuffle}
              disabled={isShuffling}
              onMouseEnter={handleShuffleHover}
              onMouseLeave={handleShuffleLeave}
              className="shuffle-btn group flex items-center gap-2 text-stone hover:text-forest transition-colors disabled:opacity-40"
              title="Press Space to shuffle"
            >
              <ArrowsClockwiseIcon className={`w-4 h-4 ${isShuffling ? "animate-spin" : ""}`} />
              <span className="text-sm">{isShuffling ? "Shuffling..." : "Shuffle"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Add Quote button */}
      <div className="flex justify-center pb-8">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="add-quote-btn flex items-center gap-2 bg-sage text-ivory px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add a Quote
        </button>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-stone/60">© {new Date().getFullYear()} Quotes</p>
      </footer>

      {/* Modal */}
      <AddQuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default HomePage;
