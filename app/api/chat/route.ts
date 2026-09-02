import {
  branches,
  clinic,
  director,
  hmoPlans,
  services,
} from "@/lib/clinic";

const facts = [
  `${clinic.name} (${clinic.legalName}), known to patients as ${clinic.familiarName}. A family clinic in Lagos, Nigeria, established ${clinic.established}. Motto: "${clinic.tagline}".`,
  `Opening hours: ${clinic.openingHours}`,
  `Branches: ${branches
    .map((b) => `${b.name} — ${b.address}, phone ${b.tel.label}`)
    .join("; ")}.`,
  `Email: ${clinic.email}. Director's line: ${clinic.directorLine.label}.`,
  `Services: ${services.map((s) => s.name).join(", ")}.`,
  `HMOs: ${clinic.hmoCount} plans accepted at both branches, including ${hmoPlans.join(", ")}.`,
  `Medical Director: ${director.name}. ${director.bio}`,
  `Booking: use the "Book Appointment" button on this page (it opens WhatsApp to the chosen branch with the details ready to send), or call the branch directly. Walk-ins are welcome at both branches.`,
].join("\n");

const systemPrompt = `You are the website assistant for ${clinic.name}. Answer visitors' questions using only the facts below.

${facts}

Rules:
- Keep every answer to 1-3 short sentences. Be direct and answer the question first. No greeting, no preamble, no sign-off.
- Plain text only. No markdown, no bullet points, no headings, no emoji.
- Only state what the facts above support. If you do not know, say so in one sentence and give the branch phone numbers.
- Never give medical advice, diagnosis, or drug guidance. Instead tell them to book an appointment or call the clinic.`;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";

type IncomingMessage = { role?: unknown; content?: unknown };

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Assistant not configured" }, { status: 503 });
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages)) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const history = (body.messages as IncomingMessage[])
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-8)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: (m.content as string).slice(0, 600),
    }));

  if (history.length === 0) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...history],
        max_tokens: 256,
        temperature: 0.2,
        reasoning_effort: "low",
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!upstream.ok) {
      return Response.json({ error: "Assistant unavailable" }, { status: 502 });
    }

    const data = await upstream.json();
    const reply: unknown = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return Response.json({ error: "Assistant unavailable" }, { status: 502 });
    }

    return Response.json({ reply: reply.trim() });
  } catch {
    return Response.json({ error: "Assistant unavailable" }, { status: 502 });
  }
}
