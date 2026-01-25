
import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import Avatar from "./Avatar";

import {
  PrismicRichText,
  SliceComponentProps,
} from "@prismicio/react";

/**
 * Props for `Biography`.
 */
export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

/**
 * Component for "Biography" Slices.
 */
const Biography = ({ slice }: BiographyProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]">
        <Heading as="h1" size="xl" className="col-start-1">
          {slice.primary.heading}
        </Heading>

        <div className="prose prose-xl prose-invert col-start-1 text-slate-200 prose-p:text-slate-200 prose-p:leading-relaxed prose-li:text-slate-200 prose-a:text-yellow-400">
          <PrismicRichText field={slice.primary.description} />
        </div>
        <Button
          linkField={slice.primary.button_link}
          label={slice.primary.button_text}
        />

<Avatar
  image={slice.primary.avatar}
  className="row-start-1 w-full h-full object-cover md:col-start-2 md:row-end-3"
/>

      </div>
    </Bounded>
  );
};

export default Biography;
