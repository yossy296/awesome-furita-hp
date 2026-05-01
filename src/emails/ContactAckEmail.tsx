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

export interface ContactAckEmailProps {
  name: string;
  message: string;
  brand?: string;
  replyEmail?: string;
}

export default function ContactAckEmail({
  name,
  message,
  brand = "Furi",
  replyEmail = "furi.98.y@gmail.com",
}: ContactAckEmailProps) {
  const previewText = `${name} 様、お問い合わせありがとうございます`;

  return (
    <Html lang="ja">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandLabel}>{brand}</Text>
            <Heading style={h1}>お問い合わせありがとうございます</Heading>
          </Section>

          <Section style={card}>
            <Text style={greet}>{name} 様</Text>
            <Text style={p}>
              この度は {brand} へお問い合わせいただき、誠にありがとうございます。
              <br />
              以下の内容で承りました。
            </Text>
            <Text style={p}>
              通常 <strong style={strong}>2〜3 営業日以内</strong> にご返信いたします。今しばらくお待ちください。
            </Text>
          </Section>

          <Section style={messageWrap}>
            <Text style={messageLabel}>お送りいただいた内容</Text>
            <Text style={messageBody}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            このメールは自動送信されています。
            <br />
            ご返信は <a href={`mailto:${replyEmail}`} style={link}>{replyEmail}</a> までお願いいたします。
          </Text>
          <Text style={signature}>— {brand}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const sans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif";
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
  fontSize: 22,
  lineHeight: 1.4,
  fontWeight: 700,
  color: ink,
};

const card: React.CSSProperties = {
  backgroundColor: card$,
  border: `1px solid ${line}`,
  borderRadius: 16,
  padding: "20px 20px 8px",
};

const greet: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 16,
  fontWeight: 600,
  color: ink,
};

const p: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 14,
  lineHeight: 1.8,
  color: ink,
};

const strong: React.CSSProperties = {
  color: ink,
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
  fontSize: 14,
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
  lineHeight: 1.7,
  color: muted,
  textAlign: "center" as const,
};

const link: React.CSSProperties = {
  color: ink,
  textDecoration: "underline",
};

const signature: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: 12,
  color: muted,
  textAlign: "center" as const,
  letterSpacing: 1.5,
};
