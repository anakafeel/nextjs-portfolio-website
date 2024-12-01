"use client";

import { SliceSimulator } from "@slicemachine/adapter-next/simulator";
import { SliceZone } from "@prismicio/react";
import { components } from "../../slices";

// Disable static generation for this page
export const dynamic = "force-dynamic";

// Increase timeout if needed (optional)
export const maxDuration = 120; // 120 seconds

export default function SliceSimulatorPage() {
  return (
    <div className="min-h-screen">
      <SliceSimulator
        background="#292441"
        sliceZone={(props) => (
          <SliceZone {...props} components={components} />
        )}
      />
    </div>
  );
}
