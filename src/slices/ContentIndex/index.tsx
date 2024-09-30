import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import ContentList from "./ContentList";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
/**
 * Props for `BlogPostIndex`.
 */
export type ContentIndexProps =
  SliceComponentProps<Content.ContentIndexSlice>;

/**
 * Component for "BlogPostIndex" Slices.
 */
const ContentIndex = async ({
  slice }: ContentIndexProps): Promise<JSX.Element> => {
  const client = createClient();
  const blogPosts = await client.getAllByType("blog_post");
  const projects = await client.getAllByType("project");

  const contentType = slice.primary.content_type || "Blog"

  const items = contentType === "Blog" ? blogPosts : projects;

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex justify-center items-center min-h-screen"
    >
      <div className="w-full max-w-3xl">
        <Heading size="xl" className="mb-8">
          {slice.primary.heading}
        </Heading>
        {isFilled.richText(slice.primary.description) && (
          <div className="prose prose-xl prose-invert mb-10">
            <PrismicRichText field={slice.primary.description} />
          </div>
        )}
        <ContentList
          items={items}
          contentType={contentType}
          viewMoreText={slice.primary.view_more_text}
          fallbackItemImage={slice.primary.fallback_item_image}
        />
      </div>
    </Bounded>
  );
};

export default ContentIndex;