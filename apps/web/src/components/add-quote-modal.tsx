import { useGSAP } from "@gsap/react";
import { Check, X } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import useReducedMotion from "../hooks/use-reduced-motion";
import { createQuote, quoteKeys } from "../query-options";

const createQuoteSchema = z.object({
  text: z.string().min(1, "Quote text is required"),
  author: z.string().min(1, "Author is required"),
});

interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddQuoteModal({ isOpen, onClose }: AddQuoteModalProps) {
  const queryClient = useQueryClient();
  const reduced = useReducedMotion();
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const createQuoteMutation = useMutation({
    mutationFn: createQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all });
    },
  });

  const form = useForm({
    defaultValues: { text: "", author: "" },
    validators: {
      onChange: createQuoteSchema,
    },
    onSubmit: async ({ value }) => {
      await createQuoteMutation.mutateAsync(value);
      form.reset();
    },
  });

  // Handle close with animation
  const handleClose = useCallback(() => {
    if (isClosing || reduced || !modalRef.current || !backdropRef.current) {
      onClose();
      return;
    }

    setIsClosing(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsClosing(false);
        onClose();
      },
    });

    tl.to(modalRef.current, {
      autoAlpha: 0,
      scale: 0.95,
      y: 10,
      duration: 0.2,
      ease: "power2.in",
    }).to(backdropRef.current, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, "-=0.15");
  }, [isClosing, reduced, onClose]);

  // Modal open animation
  useGSAP(
    () => {
      if (reduced || !modalRef.current || !backdropRef.current || !isOpen || isClosing) return;

      gsap.fromTo(
        backdropRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2, ease: "power2.out" },
      );
      gsap.fromTo(
        modalRef.current,
        { autoAlpha: 0, scale: 0.95, y: 20 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.2)", delay: 0.1 },
      );
    },
    { scope: modalRef, dependencies: [isOpen, isClosing, reduced] },
  );

  // Success state animation
  useGSAP(
    () => {
      if (reduced || !successRef.current || !createQuoteMutation.isSuccess) return;

      const tl = gsap.timeline({ defaults: { ease: "back.out" } });

      tl.from(successRef.current.querySelector(".success-circle"), {
        scale: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      })
        .from(
          successRef.current.querySelector(".success-icon"),
          { scale: 0, duration: 0.3, ease: "back.out(1.4)" },
          "-=0.2",
        )
        .from(
          successRef.current.querySelector(".success-text"),
          { autoAlpha: 0, y: 10, duration: 0.3 },
          "-=0.1",
        )
        .from(
          successRef.current.querySelector(".success-btn"),
          { autoAlpha: 0, duration: 0.3 },
          "-=0.1",
        );
    },
    { scope: successRef, dependencies: [createQuoteMutation.isSuccess, reduced] },
  );

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClose();
          }
        }}
      />

      {/* Modal card */}
      <div ref={modalRef} className="relative bg-ivory rounded-2xl max-w-md w-full p-8 shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-stone hover:text-forest transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-2xl text-forest mb-6">Add a Quote</h2>

        {createQuoteMutation.isSuccess ? (
          <div ref={successRef} className="text-center py-8 space-y-3">
            <div className="success-circle w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center mx-auto">
              <Check className="success-icon w-6 h-6 text-sage" aria-label="Success checkmark" />
            </div>
            <p className="success-text text-forest font-medium">Quote added!</p>
            <button
              type="button"
              onClick={() => {
                createQuoteMutation.reset();
                form.reset();
              }}
              className="success-btn text-sm text-stone hover:text-forest transition-colors underline"
            >
              Add another
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <form.Field name="text">
              {(field) => (
                <div className="space-y-1.5">
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-medium text-stone uppercase tracking-wider"
                  >
                    Quote
                  </label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    placeholder="Enter a meaningful quote..."
                    className="w-full bg-linen rounded-lg px-4 py-3 text-forest placeholder:text-stone/50 border border-transparent focus:border-sage/50 focus:outline-none transition-colors resize-none font-serif"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-red-600/70">
                      {String(field.state.meta.errors[0]?.message)}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="author">
              {(field) => (
                <div className="space-y-1.5">
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-medium text-stone uppercase tracking-wider"
                  >
                    Author
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Who said this?"
                    className="w-full bg-linen rounded-lg px-4 py-3 text-forest placeholder:text-stone/50 border border-transparent focus:border-sage/50 focus:outline-none transition-colors"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-red-600/70">
                      {String(field.state.meta.errors[0]?.message)}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full bg-forest text-cream rounded-full py-3 text-sm font-medium hover:bg-forest/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Quote"}
                </button>
              )}
            </form.Subscribe>

            {createQuoteMutation.isError && (
              <p className="text-xs text-red-600/70 text-center">
                Failed to submit: {createQuoteMutation.error.message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default AddQuoteModal;
