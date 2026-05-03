import nodemailer from "nodemailer";

function buildVerificationEmail(name: string, url: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Confirm your registration</h2>
      <p>Hi ${name},</p>
      <p>Thanks for registering! Click the button below to verify your email and confirm your participation.</p>
      <a href="${url}" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin:16px 0;">
        Verify my email
      </a>
      <p style="color:#666;font-size:14px;">Or copy this link: ${url}</p>
      <p style="color:#999;font-size:12px;">If you did not register, you can ignore this email.</p>
    </div>
  `;
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const url = `${appUrl}/verify?token=${token}`;
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Restaurant Contest";

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `${appName} <noreply@resend.dev>`,
      to,
      subject: `Confirm your registration — ${appName}`,
      html: buildVerificationEmail(name, url),
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port: Number(process.env.SMTP_PORT ?? 1025),
    auth:
      process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@contest.com",
    to,
    subject: `Confirm your registration — ${appName}`,
    html: buildVerificationEmail(name, url),
  });
}
