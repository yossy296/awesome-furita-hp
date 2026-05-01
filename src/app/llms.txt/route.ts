import { getPayload } from "payload";
import config from "@payload-config";
import { SITE } from "@/lib/site";
import { getExcerpt } from "@/lib/extractFirstImage";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const payload = await getPayload({ config });
  const { docs } = await payload
    .find({
      collection: "posts",
      limit: 50,
      sort: "-publishedAt",
      where: { status: { equals: "published" } },
    })
    .catch(() => ({ docs: [] as any[] }));

  const posts = (docs as any[])
    .map((p) => {
      const url = `${SITE.url}/blog/${p.slug}`;
      const desc = getExcerpt(p.bodyJson, 120);
      return `- [${p.title}](${url})${desc ? `: ${desc}` : ""}`;
    })
    .join("\n");

  const body = `# ${SITE.brand}

> ${SITE.description}

${SITE.brandFull}（${SITE.legalName}）の個人サイト。3度のうつ病・ADHD診断を経て32カ国を踏破。立ち止まる人の次の一歩を創るためのポートフォリオ・ブログ・問い合わせ窓口。

## Pages

- [Home](${SITE.url}): プロフィール、訪問国、コーチング、提携先、最新記事、問い合わせフォーム
- [Blog](${SITE.url}/blog): ADHD・うつ病・32カ国の旅で得た学びを言葉にした記録の一覧

## Posts

${posts || "(no published posts yet)"}

## Optional

- [Contact](${SITE.url}/#contact): 問い合わせフォーム（送信内容は ${SITE.brand} に届きます）
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
