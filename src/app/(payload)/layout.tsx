/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from "next";
import config from "@payload-config";
import "@payloadcms/next/css";
import { RootLayout } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";

import { importMap } from "./admin/importMap";

import "./custom.scss";

// Admin / Payload UI must never be indexed by search engines or LLMs.
// Strip OG/Twitter cards too — admin pages shouldn't surface anywhere.
export const metadata: Metadata = {
  title: "Admin",
  description: null,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": 0,
      "max-image-preview": "none",
      "max-video-preview": 0,
    },
  },
  openGraph: null,
  twitter: null,
  alternates: { canonical: null },
};

type Args = { children: React.ReactNode };

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  const { handleServerFunctions } = await import("@payloadcms/next/layouts");
  return handleServerFunctions({ ...args, config, importMap });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
