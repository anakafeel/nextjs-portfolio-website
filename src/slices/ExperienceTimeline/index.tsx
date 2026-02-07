"use client";

import { FC, useLayoutEffect, useMemo, useRef } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import type { RichTextField } from "@prismicio/client";

export type ExperienceTimelineProps =
  SliceComponentProps<Content.ExperienceTimelineSlice>;

function richTextToPlain(field: RichTextField | undefined): string {
  if (!Array.isArray(field)) return "";
  return field
    .map((b: any) => (typeof b?.text === "string" ? b.text : ""))
    .join("\n")
    .trim();
}

function techToChips(field: RichTextField | undefined): string[] {
  const txt = richTextToPlain(field);
  if (!txt) return [];
  return txt
    .split(/[\n,•]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getLogoUrl(item: any): string | null {
  const url = item?.logo?.url;
  return typeof url === "string" && url.length > 0 ? url : null;
}

const ExperienceTimeline: FC<ExperienceTimelineProps> = ({ slice }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);


  const items: any[] = (slice.primary?.items as any[]) ?? slice.items ?? [];

  const techChipsByIdx = useMemo(() => {
    return items.map((item) =>
      isFilled.richText(item.tech) ? techToChips(item.tech) : [],
    );
  }, [items]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    let ctx: any;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const fillEl = container.querySelector<HTMLElement>("[data-fill]");
      const navItems = Array.from(
        container.querySelectorAll<HTMLElement>("[data-nav-item]"),
      );
      const slides = Array.from(
        container.querySelectorAll<HTMLElement>("[data-slide]"),
      );
      const cards = Array.from(
        container.querySelectorAll<HTMLElement>("[data-card]"),
      );

      if (slides.length === 0) return;

      ctx = gsap.context(() => {
        // Initial states
        gsap.set(slides, { autoAlpha: 0, scale: 0.95 });
        gsap.set(slides[0], { autoAlpha: 1, scale: 1 });

        if (cards[0]) {
          gsap.set(cards[0], {
            boxShadow: "0 0 60px rgba(168, 85, 247, 0.15), 0 25px 50px rgba(0,0,0,0.4)"
          });
        }

        navItems.forEach((nav, i) => {
          const txt = nav.querySelector("[data-nav-text]");
          if (i === 0) {
            gsap.set(nav, { opacity: 1, x: 4 });
            if (txt) gsap.set(txt, { color: "rgb(192,132,252)" });
          } else {
            gsap.set(nav, { opacity: 0.4, x: 0 });
            if (txt) gsap.set(txt, { color: "rgba(255,255,255,0.7)" });
          }
        });

        if (fillEl) {
          gsap.set(fillEl, { scaleY: 1 / slides.length, transformOrigin: "top center" });
        }

        // Scroll distance
        const scrollPerSlide = window.innerHeight * 0.85;
        const totalScroll = scrollPerSlide * slides.length;

        // Main timeline with pin
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            pin: true,
            start: "top top",
            end: `+=${totalScroll}`,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Progress fill bar
        if (fillEl) {
          tl.to(fillEl, { scaleY: 1, ease: "none", duration: slides.length }, 0);
        }

        // Slide transitions
        for (let i = 1; i < slides.length; i++) {
          const prev = i - 1;
          const startPos = i;

          // Fade out previous slide
          tl.to(slides[prev], {
            autoAlpha: 0,
            scale: 0.92,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power2.inOut"
          }, startPos - 0.5);

          if (cards[prev]) {
            tl.to(cards[prev], {
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              duration: 0.3
            }, startPos - 0.5);
          }

          // Fade in current slide
          tl.to(slides[i], {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out"
          }, startPos - 0.3);

          if (cards[i]) {
            tl.to(cards[i], {
              boxShadow: "0 0 60px rgba(168, 85, 247, 0.15), 0 25px 50px rgba(0,0,0,0.4)",
              duration: 0.4
            }, startPos - 0.2);
          }

          // Nav transitions
          const prevNav = navItems[prev];
          const currNav = navItems[i];

          if (prevNav) {
            tl.to(prevNav, { opacity: 0.4, x: 0, duration: 0.3 }, startPos - 0.4);
            const prevTxt = prevNav.querySelector("[data-nav-text]");
            if (prevTxt) {
              tl.to(prevTxt, { color: "rgba(255,255,255,0.7)", duration: 0.3 }, startPos - 0.4);
            }
          }

          if (currNav) {
            tl.to(currNav, { opacity: 1, x: 4, duration: 0.3 }, startPos - 0.3);
            const currTxt = currNav.querySelector("[data-nav-text]");
            if (currTxt) {
              tl.to(currTxt, { color: "rgb(192,132,252)", duration: 0.3 }, startPos - 0.3);
            }
          }
        }

        // Hold at end
        tl.to({}, { duration: 0.6 });

      }, container);
    })();

    return () => {
      ctx?.revert();
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative flex flex-col justify-center bg-transparent px-4 pb-16 pt-20 sm:px-6 md:min-h-screen md:py-12 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <header className="mb-8 max-w-2xl text-center md:text-left mx-auto md:mx-0">
          {slice.primary?.heading && (
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              {slice.primary.heading}
            </h2>
          )}
          <div className="mt-3 text-white/60 leading-relaxed text-sm sm:text-base">
            {isFilled.richText(slice.primary?.intro) ? (
              <PrismicRichText field={slice.primary.intro} />
            ) : slice.primary?.intro ? (
              <p>{String(slice.primary.intro)}</p>
            ) : null}
          </div>
        </header>

        {/* Story panel */}
        <div className="relative mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm md:max-w-none md:rounded-3xl">
          <div className="grid h-auto grid-cols-1 items-start gap-6 p-4 sm:p-6 md:min-h-[60vh] md:grid-cols-[200px_1fr] md:gap-8 md:p-10 lg:grid-cols-[220px_1fr] lg:p-12">

            {/* Left nav - fill bar only */}
            <aside className="relative hidden h-full md:flex md:items-center">
              <div className="relative">
                {/* Track */}
                <div className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-white/10" />
                {/* Fill */}
                <div
                  data-fill
                  className="absolute left-0 top-0 h-full w-[2px] origin-top rounded-full bg-gradient-to-b from-purple-400 via-purple-500 to-fuchsia-500"
                />

                <ul className="relative ml-5 space-y-5">
                  {items.map((item, idx) => (
                    <li key={idx} data-nav-item className="relative pl-2">
                      <div
                        data-nav-text
                        className="text-sm font-medium leading-snug transition-colors duration-300"
                      >
                        {item.role ?? `Role ${idx + 1}`}
                      </div>
                      <div className="mt-0.5 text-xs text-white/40">
                        {item.company ?? ""}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Slides */}
            <div className="relative w-full md:flex md:min-h-[50vh] md:items-center md:justify-center">
              {items.map((item, idx) => {
                const chips = techChipsByIdx[idx] ?? [];
                const logoUrl = getLogoUrl(item);

                return (
                  <article
                    key={idx}
                    data-slide
                    className={`group flex justify-center ${idx === 0 ? 'relative' : 'absolute inset-0 invisible opacity-0'} md:absolute md:inset-0 md:flex md:items-center`}
                  >
                    <div
                      data-card
                      className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border border-white/10
                                 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 sm:max-w-lg sm:rounded-2xl sm:p-6 md:max-w-2xl md:rounded-3xl md:p-10"
                    >
                      {/* Hover logo overlay - covers entire card (desktop only via CSS media query) */}
                      <div
                        className="hover-overlay-desktop pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xl
                                   opacity-0 transition-all duration-500 ease-out sm:rounded-2xl md:rounded-3xl"
                      >
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-950/90 to-slate-900/95" />

                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={`${item.company ?? "Company"} logo`}
                            className="absolute inset-0 h-full w-full object-contain p-8 drop-shadow-2xl sm:p-12"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="select-none text-5xl font-black tracking-tighter text-white/15 sm:text-7xl">
                              {String(item.company ?? "LOGO").slice(0, 10)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            {item.role && (
                              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                                {item.role}
                              </h3>
                            )}
                            {item.company && (
                              <div className="mt-1 text-sm text-white/50">{item.company}</div>
                            )}
                          </div>
                          {(item.startdate || item.enddate) && (
                            <div className="text-xs text-white/40 sm:text-right sm:text-sm">
                              {item.startdate ?? ""}
                              {item.startdate && item.enddate ? " — " : ""}
                              {item.enddate ?? ""}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                          {Array.isArray(item.summary) ? (
                            <PrismicRichText field={item.summary} />
                          ) : item.summary ? (
                            <p>{String(item.summary)}</p>
                          ) : null}
                        </div>

                        {chips.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                            {chips.map((t, i) => (
                              <span
                                key={i}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5
                                           text-[11px] text-white/60 transition hover:bg-white/[0.08] sm:px-3 sm:py-1 sm:text-xs"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;

/* new resume link added */