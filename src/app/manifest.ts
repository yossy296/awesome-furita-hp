import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.brandFull,
    short_name: SITE.brand,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F4F5F2",
    theme_color: "#0E1014",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
