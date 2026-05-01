import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
const fromName = process.env.MAIL_FROM_NAME || "Furi";
const to = "netrunners.business@gmail.com";

if (!user || !pass) {
  console.error("missing GMAIL_USER or GMAIL_APP_PASSWORD");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user, pass },
});

try {
  await transporter.verify();
  console.log("[verify] SMTP auth OK");
} catch (err) {
  console.error("[verify] failed:", err.message);
  process.exit(1);
}

const info = await transporter.sendMail({
  from: `"${fromName}" <${user}>`,
  to,
  subject: `[${fromName}] テスト送信 — ${new Date().toLocaleString("ja-JP")}`,
  text: `これは furita-hp のお問い合わせフォーム経由（Gmail SMTP / Nodemailer）の疎通テストです。\n\n送信元: ${user}\n宛先: ${to}\n時刻: ${new Date().toISOString()}`,
  html: `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">${fromName} — テスト送信</h2>
      <p>これは furita-hp のお問い合わせフォーム経由（Gmail SMTP / Nodemailer）の疎通テストです。</p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:6px 12px;color:#666">送信元</td><td style="padding:6px 12px">${user}</td></tr>
        <tr><td style="padding:6px 12px;color:#666">宛先</td><td style="padding:6px 12px">${to}</td></tr>
        <tr><td style="padding:6px 12px;color:#666">時刻</td><td style="padding:6px 12px">${new Date().toISOString()}</td></tr>
      </table>
    </div>
  `,
});

console.log("[send] messageId:", info.messageId);
console.log("[send] response:", info.response);
console.log("[send] accepted:", info.accepted);
console.log("[send] rejected:", info.rejected);
