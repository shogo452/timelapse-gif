import { Resend } from "resend";

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
}

const typeLabels: Record<string, string> = {
  bug: "Bug Report",
  feature: "Feature Request",
  question: "Question",
  other: "Other",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_DETAILS_LENGTH = 5000;
const MAX_BROWSER_OS_LENGTH = 200;

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  // CSRF: validate Origin header matches the request's own origin
  const origin = request.headers.get("Origin");
  const requestUrl = new URL(request.url);
  if (!origin || new URL(origin).origin !== requestUrl.origin) {
    return Response.json(
      { error: "Forbidden: origin mismatch" },
      { status: 403 }
    );
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    return Response.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const resend = new Resend(env.RESEND_API_KEY);

  try {
    const formData = await request.formData();
    const feedbackType = formData.get("feedbackType") as string;
    const details = formData.get("details") as string;
    const browserOs = (formData.get("browserOs") as string) || "Not provided";
    const email = (formData.get("email") as string) || "Not provided";
    const files = formData.getAll("screenshots") as File[];

    if (!feedbackType || !details) {
      return Response.json(
        { error: "feedbackType and details are required" },
        { status: 400 }
      );
    }

    // Validate feedbackType against whitelist
    if (!(feedbackType in typeLabels)) {
      return Response.json(
        { error: "Invalid feedbackType" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (details.length > MAX_DETAILS_LENGTH) {
      return Response.json(
        { error: `details must be at most ${MAX_DETAILS_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (browserOs.length > MAX_BROWSER_OS_LENGTH) {
      return Response.json(
        { error: `browserOs must be at most ${MAX_BROWSER_OS_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email !== "Not provided" && !EMAIL_REGEX.test(email)) {
      return Response.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Build attachments from uploaded files (only allow image/* MIME types)
    const attachments: { filename: string; content: Buffer }[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) continue;
      if (!file.type.startsWith("image/")) continue;
      const buffer = await file.arrayBuffer();
      attachments.push({
        filename: file.name,
        content: Buffer.from(buffer),
      });
    }

    const label = typeLabels[feedbackType];

    const { error } = await resend.emails.send({
      from: "Timelapse GIF <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL],
      subject: `[Timelapse GIF] ${label}`,
      html: `
        <h2>${label}</h2>
        <p><strong>Details:</strong></p>
        <pre style="white-space:pre-wrap;">${escapeHtml(details)}</pre>
        <p><strong>Browser & OS:</strong> ${escapeHtml(browserOs)}</p>
        <p><strong>Reply Email:</strong> ${escapeHtml(email)}</p>
        ${attachments.length > 0 ? `<p><em>${attachments.length} screenshot(s) attached</em></p>` : ""}
      `,
      ...(attachments.length > 0 ? { attachments } : {}),
    });

    if (error) {
      console.error("Resend API error:", error);
      return Response.json(
        { error: "Failed to send email" },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
