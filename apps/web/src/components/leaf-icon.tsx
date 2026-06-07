import { useGSAP } from "@gsap/react";
import { LeafIcon } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { useRef } from "react";
import useReducedMotion from "../hooks/use-reduced-motion";

function LeafIconComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      if (!containerRef.current) return;

      const icon = containerRef.current.querySelector("svg");
      if (!icon) return;

      gsap.to(icon, {
        y: -3,
        rotation: 3,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <div ref={containerRef}>
      <LeafIcon className="w-6 h-6 text-stone" aria-label="Leaf icon" />
    </div>
  );
}

export default LeafIconComponent;
