import { createElement } from "react";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { getPayload } from "payload";
import config from "@payload-config";
import ContactEmail from "@/emails/ContactEmail";
import ContactAckEmail from "@/emails/ContactAckEmail";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  const to = process.env.CONTACT_TO || user;
  const fromName = process.env.MAIL_FROM_NAME || "Furi";

  if (!user || !pass) {
    return NextResponse.json({ error: "mail_not_configured" }, { status: 500 });
  }

  // 1) Persist to Payload `contacts` collection FIRST. DB is the source of truth —
  // if this fails, abort before sending any email.
  let savedId: string | number | undefined;
  try {
    const payload = await getPayload({ config });
    const doc = await payload.create({
      collection: "contacts",
      data: { name, email, message },
    });
    savedId = doc.id;
    console.log(`[contact] saved to db (id=${savedId})`);
  } catch (err) {
    console.error("[contact] db save failed", err);
    return NextResponse.json({ error: "db_save_failed" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const notifyEl = createElement(ContactEmail, { name, email, message, brand: fromName });
  const ackEl = createElement(ContactAckEmail, { name, message, brand: fromName, replyEmail: user });

  const [notifyHtml, notifyText, ackHtml, ackText] = await Promise.all([
    render(notifyEl),
    render(notifyEl, { plainText: true }),
    render(ackEl),
    render(ackEl, { plainText: true }),
  ]);

  // 1) Notification → Furi (admin). Failure is fatal.
  try {
    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `[${fromName}] お問い合わせ — ${name}`,
      text: notifyText,
      html: notifyHtml,
    });
  } catch (err) {
    console.error("[contact] notify mail failed", err);
    return NextResponse.json({ error: "mail_failed" }, { status: 502 });
  }

  // 2) Auto-reply → visitor. Failure is non-fatal (admin already notified).
  try {
    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to: `"${name}" <${email}>`,
      replyTo: user,
      subject: `お問い合わせありがとうございます — ${fromName}`,
      text: ackText,
      html: ackHtml,
    });
  } catch (err) {
    console.error("[contact] ack mail failed (non-fatal)", err);
  }

  return NextResponse.json({ ok: true, id: savedId });
}
