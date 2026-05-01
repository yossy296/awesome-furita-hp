import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
  brand?: string;
  receivedAt?: string;
}

export default function ContactEmail({
  name,
  email,
  message,
  brand = "Furi",
  receivedAt,
}: ContactEmailProps) {
  const ts =
    receivedAt ??
    new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      hour12: false,
    });

  const previewText = `${name} さんから新しいお問い合わせ`;

  return (
    <Html lang="ja">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandLabel}>{brand}</Text>
            <Heading style={h1}>新しいお問い合わせ</Heading>
            <Text style={subtle}>{ts}</Text>
          </Section>

          <Section style={card}>
            <Row label="お名前" value={name} />
            <Row label="Email" value={email} mono />
          </Section>

          <Section style={messageWrap}>
            <Text style={messageLabel}>メッセージ</Text>
            <Text style={messageBody}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            このメールは {brand} のお問い合わせフォームから自動送信されました。
            <br />
            返信すると {name} さん（{email}）に届きます。
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <table style={rowTable} cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td style={rowLabel}>{label}</td>
          <td style={{ ...rowValue, fontFamily: mono ? mono$ : undefined }}>
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const sans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif";
const mono$ =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Cascadia Mono', 'Source Code Pro', monospace";
const ink = "#0E1014";
const muted = "#6B7280";
const line = "#E5E7EB";
const accent = "#C7F060";
const card$ = "#FFFFFF";
const bg = "#F4F5F2";

const body: React.CSSProperties = {
  margin: 0,
  padding: "32px 0",
  backgroundColor: bg,
  fontFamily: sans,
  color: ink,
};

const container: React.CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
  padding: "0 16px",
};

const header: React.CSSProperties = {
  padding: "8px 4px 24px",
};

const brandLabel: React.CSSProperties = {
  margin: 0,
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  backgroundColor: accent,
  color: ink,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.2,
  textTransform: "uppercase",
};

const h1: React.CSSProperties = {
  margin: "12px 0 6px",
  fontSize: 24,
  lineHeight: 1.3,
  fontWeight: 700,
  color: ink,
};

const subtle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: muted,
};

const card: React.CSSProperties = {
  backgroundColor: card$,
  border: `1px solid ${line}`,
  borderRadius: 16,
  padding: "8px 16px",
};

const rowTable: React.CSSProperties = {
  width: "100%",
  borderBottom: `1px solid ${line}`,
};

const rowLabel: React.CSSProperties = {
  padding: "12px 0",
  width: 96,
  color: muted,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: "uppercase",
  verticalAlign: "top",
};

const rowValue: React.CSSProperties = {
  padding: "12px 0",
  color: ink,
  fontSize: 15,
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const messageWrap: React.CSSProperties = {
  marginTop: 16,
  backgroundColor: card$,
  border: `1px solid ${line}`,
  borderRadius: 16,
  padding: 20,
};

const messageLabel: React.CSSProperties = {
  margin: "0 0 8px",
  color: muted,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: "uppercase",
};

const messageBody: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.7,
  whiteSpace: "pre-wrap",
  color: ink,
};

const hr: React.CSSProperties = {
  margin: "24px 0 12px",
  border: "none",
  borderTop: `1px solid ${line}`,
};

const footer: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.6,
  color: muted,
  textAlign: "center" as const,
};
