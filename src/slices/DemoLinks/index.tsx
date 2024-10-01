import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import Button from "@/components/Button";
/**
 * Props for `DemoLinks`.
 */
export type DemoLinksProps = SliceComponentProps<Content.DemoLinksSlice>;

/**
 * Component for "DemoLinks" Slices.
 */
const DemoLinks = ({ slice }: DemoLinksProps): JSX.Element => {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {slice.primary.button.map((item, index) => (
        <Button
          key={index} // Adding a key for each mapped item
          linkField={item.button_link}
          label={item.button_text}
        />
      ))}
    </div>
  );
};

export default DemoLinks;