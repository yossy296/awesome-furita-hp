import type { Person, WebSite, WithContext } from "schema-dts";
import { getPayload } from "payload";
import config from "@payload-config";
import { getLocale } from "@/i18n/getLocale";
import { SITE, absoluteUrl } from "@/lib/site";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatIDo from "@/components/WhatIDo";
import Journey from "@/components/Journey";
import Works from "@/components/Works";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SmoothScroll from "@/components/SmoothScroll";
import FluidCursor from "@/components/FluidCursor";
import CursorTrail from "@/components/CursorTrail";
import CustomCursor from "@/components/CustomCursor";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export default async function Home() {
  const payload = await getPayload({ config });
  const locale = await getLocale();

  const [countriesRes, partnersRes, postsRes] = await Promise.all([
    payload.find({ collection: "countries", limit: 12, sort: "order", locale }).catch(() => ({ docs: [] })),
    payload.find({ collection: "partners", limit: 12, sort: "order", locale }).catch(() => ({ docs: [] })),
    payload.find({
      collection: "posts",
      limit: 4,
      sort: "-publishedAt",
      locale,
      where: { status: { equals: "published" } },
    }).catch(() => ({ docs: [] })),
  ]);

  const websiteLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.brand,
    alternateName: SITE.brandFull,
    url: SITE.url,
    description: SITE.description,
    inLanguage: ["ja", "en"],
  };

  const personLd: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.brand,
    alternateName: SITE.legalName,
    url: SITE.url,
    image: absoluteUrl(SITE.defaultOgImage),
    description: SITE.description,
    jobTitle: "Backpacker / Coach / Founder",
    knowsAbout: [
      "ADHD",
      "うつ病",
      "海外バックパック",
      "コーチング",
      "起業",
    ],
  };

  return (
    <>
      <JsonLd data={[websiteLd, personLd]} />
      <FluidCursor />
      <CursorTrail />
      <CustomCursor />
      <SmoothScroll />
      <Nav />
      <Hero />
      <About />
      <WhatIDo />
      <Journey countries={countriesRes.docs} />
      <Works partners={partnersRes.docs} />
      <Blog posts={postsRes.docs} />
      <Contact />
      <Footer />
      <BackToTop />
    </>
  );
}
