"use client";
import { useEffect, useRef } from "react";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import gsap from 'gsap';
import Bounded from "@/components/Bounded";

import Computers from './Computers'

export type HomepageProps = SliceComponentProps<Content.HomepageSlice>;

const Homepage = ({ slice }: HomepageProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".name-animation",
        { x: -100, opacity: 0, rotate: -10 },
        {
          x: 0,
          opacity: 1,
          rotate: 0,

          ease: "elastic.out(1,0.3)",
          duration: 1,
          transformOrigin: "left top",
          stagger: { each: 0.1, from: "random" },
        }
      ).fromTo(
        ".tag-title",
        {
          y: 20,
          opacity: 0,
          scale: 1.2,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1.3,
          ease: "elastic.out(1,0.3)",
        }
      );
    }, component);

    return () => ctx.revert();
  }, []);


  const renderLetters = (name: KeyTextField, key: string) => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <span
        key={index}
        className={`name-animation name-animation-${key}-index inline-block opacity-0 `}
      >
        {letter}
      </span>
    ));
  };

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid min-h-[70vh] grid-cols-1 items-center md:grid-cols-2">
        <Computers />
        <div className="col-start-1 md:row-start-1 " data-speed=".2">
          <h1
            className="mb-8 text-[clamp(2rem,15vmin,15rem)] font-extrabold leading-none tracking-tighter"
            aria-label={
              slice.primary.firstname + " " + slice.primary.lastname
            }
          >
            <span className="block text-slate-300 ">
              {renderLetters(slice.primary.firstname, "first")}
            </span>
            <span className="-mt-[.2em] block text-slate-500  ">
              {renderLetters(slice.primary.lastname, "last")}
            </span>
          </h1>
          <span className="tag-title bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-xl font-bold uppercase tracking-[.2em] text-transparent opacity-0 md:text-3xl">
            {slice.primary.tag}
          </span>
        </div>
      </div>
    </Bounded>
  );
};

export default Homepage;