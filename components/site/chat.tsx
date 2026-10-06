"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { BookingDialog } from "@/components/site/booking-dialog";
import { healthQuestionReply, isMedicalQuestion } from "@/lib/chat-safety";
import {
  appointmentClinics,
  branches,
  callBothBranches,
  clinic,
  clinicSchedules,
  labOpeningHours,
  services,
} from "@/lib/clinic";

type Message = { id: number; from: "bot" | "user"; text: string };
type Draft = { from: "bot" | "user"; text: string };
type AnswerKey = "hmo" | "services" | "where" | "hours";
export type ChatIntent = "book" | "hmo";

type ChatState = {
  open: boolean;
  input: string;
  used: string[];
  pending: boolean;
  bookingDialogOpen: boolean;
  messages: Message[];
};

const answers: Record<AnswerKey, { label: string; q: string; a: string }> = {
  hmo: {
    label: "Do you accept my HMO plan?",
    q: "Do you accept my HMO plan?",
    a: `Yes — we accept over 70 HMO plans at both branches, including AXA Mansard, Leadway Assurance, Clearline, Clearline International, Hygeia HMO, HCI Healthcare, Healthcare Security Limited and Princeton Health.\n\nTell me the name of your plan and I will pass it to the front desk, or call your branch with your card and we will confirm on the spot — ${callBothBranches}.`,
  },
  services: {
    label: "What services do you offer?",
    q: "What services do you offer?",
    a: `Our services include ${services.map((service) => service.name).join(", ")}. ${clinic.careDescription}\n\nIf you tell me what you need, I can point you to the right unit.`,
  },
  where: {
    label: "Where are you located?",
    q: "Where are you located?",
    a: `We have two branches in Lagos:\n\n${branches
      .map(
        (b) =>
          `${b.name} — ${b.address}. Post Code: ${b.postcode}.`,
      )
      .join("\n")}\n\nBoth are marked on the map on this page.\n\nKetu: ${branches[0].tel.label}. Iju: ${branches[1].tel.label}.`,
  },
  hours: {
    label: "What are your opening hours?",
    q: "What are your opening hours?",
    a: clinic.openingHours,
  },
};

const clinicScheduleAnswer = `Scheduled clinics: ${clinicSchedules.map((item) => `${item.name}: ${item.details}`).join("; ")}. Clinics by appointment: ${appointmentClinics.join(", ")}.`;
const labHoursAnswer = `Laboratory opening hours: ${labOpeningHours
  .map(
    (location) =>
      `${location.branch}: ${location.hours.map((item) => `${item.days} ${item.time}`).join(", ")}${location.note ? `. ${location.note}` : ""}`,
  )
  .join(". ")}.`;

const quickReplyClass =
  "min-h-11 border border-pine/70 px-3.5 py-3 text-left text-sm font-bold text-pine hover:bg-pine/10";

const initialState: ChatState = {
  open: false,
  input: "",
  used: [],
  pending: false,
  bookingDialogOpen: false,
  messages: [
    {
      id: 0,
      from: "bot",
      text: `Hello, and welcome to ${clinic.name} (${clinic.familiarName}). I can help with HMO cover, our services, directions and appointments. What would you like to know?`,
    },
  ],
};

function push(state: ChatState, drafts: Draft[]): ChatState {
  return {
    ...state,
    messages: state.messages.concat(
      drafts.map((d, i) => ({ id: state.messages.length + i, ...d })),
    ),
  };
}

function markUsed(used: string[], key: string) {
  return used.includes(key) ? used : used.concat(key);
}

function askIn(state: ChatState, key: AnswerKey): ChatState {
  const answer = answers[key];
  const drafts: Draft[] = [
    { from: "user", text: answer.q },
    { from: "bot", text: answer.a },
  ];
  return push({ ...state, used: markUsed(state.used, key) }, drafts);
}

function isBookingRequest(text: string) {
  const normalized = text.toLowerCase().replace(/[’]/g, "'");
  return (
    /\b(book(?:ing)?|appoint(?:ment|ments)?|schedul(?:e|ing)|reserve)\b/.test(
      normalized,
    ) || /\b(?:see|visit) (?:a|the) (?:doctor|clinic)\b/.test(normalized)
  );
}

function offlineReply(text: string): string {
  const t = text.toLowerCase();
  if (isMedicalQuestion(text)) return healthQuestionReply;
  if (/lab|laboratory/.test(t) && /hour|open|close|time|schedule/.test(t)) {
    return labHoursAnswer;
  }
  if (/hmo|insur|cover|axa|leadway|hygeia|clearline|princeton|hci/.test(t)) {
    return answers.hmo.a;
  }
  if (
    (/schedule|when|what day|what time|clinic hours/.test(t) &&
      /clinic|antenatal|ent|orthopaed|gynae|physio|urolog|neurolog|psychiatr/.test(
        t,
      )) ||
    /urology|neurology|psychiatry/.test(t)
  ) {
    return clinicScheduleAnswer;
  }
  if (/hour|open|close|time|sunday|weekend/.test(t)) {
    return clinic.openingHours;
  }
  if (/where|locat|address|direction|ketu|iju|branch|map/.test(t)) {
    return answers.where.a;
  }
  if (
    /service|outpatient|admission|immuni|scan|ultrasound|lab|surgery|matern|physio|wellness|health check|counsell|primary|secondary/.test(
      t,
    )
  ) {
    return answers.services.a;
  }
  if (
    /pain|sick|fever|malaria|pregnan|symptom|treat|drug|medicine|diagnos|blood|hurt/.test(
      t,
    )
  ) {
    return `I am not able to give medical advice over chat. The safest step is to see one of our doctors — I can book an appointment for you now, or you can call the clinic directly — ${callBothBranches}.`;
  }
  return `I may not have that one to hand. You can call the clinic — ${callBothBranches} — or email ${clinic.email}, and the team will answer properly. I can also book you an appointment if that would help.`;
}

async function askAssistant(history: Message[], text: string): Promise<string> {
  const messages = history
    .slice(-8)
    .map((m) => ({
      role: m.from === "bot" ? "assistant" : "user",
      content: m.text,
    }))
    .concat({ role: "user", content: text });

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("assistant unavailable");
  const data = await res.json();
  if (typeof data?.reply !== "string" || !data.reply.trim()) {
    throw new Error("assistant unavailable");
  }
  return data.reply.trim();
}

const ChatContext = createContext<((intent?: ChatIntent) => void) | null>(null);

export function useChat() {
  const openChat = useContext(ChatContext);
  if (!openChat) throw new Error("useChat must be used within a ChatProvider");
  return openChat;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.messages, state.pending, state.open]);

  const openChat = useCallback((intent?: ChatIntent) => {
    setState((s) => {
      const opened = { ...s, open: true };
      if (intent === "book") return { ...opened, bookingDialogOpen: true };
      if (intent === "hmo" && !s.used.includes("hmo"))
        return askIn(opened, "hmo");
      return opened;
    });
  }, []);

  const atWelcome = !state.messages.some((m) => m.from === "user");
  const quickReplies = atWelcome
    ? (["hmo", "services", "where", "hours"] as AnswerKey[]).map((key) => ({
        key,
        label: answers[key].label,
        onClick: () => setState((s) => askIn(s, key)),
      }))
    : [];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = state.input.trim();
    if (!text || state.pending) return;

    if (isBookingRequest(text)) {
      setState((s) =>
        push({ ...s, input: "", bookingDialogOpen: true }, [
          { from: "user", text },
          {
            from: "bot",
            text: "Sure — I’m opening the appointment form for you now.",
          },
        ]),
      );
      return;
    }

    if (isMedicalQuestion(text)) {
      setState((s) =>
        push({ ...s, input: "" }, [
          { from: "user", text },
          { from: "bot", text: healthQuestionReply },
        ]),
      );
      return;
    }

    const history = state.messages;
    setState((s) =>
      push({ ...s, input: "", pending: true }, [{ from: "user", text }]),
    );

    let reply: string;
    try {
      reply = await askAssistant(history, text);
    } catch {
      reply = offlineReply(text);
    }
    setState((s) =>
      push({ ...s, pending: false }, [{ from: "bot", text: reply }]),
    );
  };

  return (
    <ChatContext.Provider value={openChat}>
      {children}
      <BookingDialog
        open={state.bookingDialogOpen}
        onOpenChange={(bookingDialogOpen) =>
          setState((s) => ({ ...s, bookingDialogOpen }))
        }
      />
      <div className="fixed right-4 bottom-4 z-60 flex flex-col items-end gap-3">
        {state.open ? (
          <div className="flex h-[min(560px,calc(100vh-120px))] w-[min(380px,calc(100vw-32px))] animate-rise flex-col overflow-hidden border border-ink/30 bg-surface shadow-panel">
            <div className="flex flex-none items-center justify-between gap-3 bg-forest px-4 py-3.5 text-surface">
              <div className="flex flex-col">
                <span className="text-lg font-bold">
                  {clinic.familiarName} Assistant
                </span>
                <span className="text-[11px] text-fern">
                  Typically replies instantly
                </span>
              </div>
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, open: false }))}
                aria-label="Close chat"
                className="size-8 border border-white/30 text-base leading-none text-surface"
              >
                ×
              </button>
            </div>

            <div
              ref={logRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
            >
              {state.messages.map((m) => (
                <div key={m.id} className="flex flex-col">
                  {m.from === "bot" ? (
                    <div className="max-w-[86%] self-start border border-ink/15 bg-fog px-3.5 py-2.5 text-sm leading-[1.65] whitespace-pre-line text-ink">
                      {m.text}
                    </div>
                  ) : (
                    <div className="max-w-[86%] self-end rounded-[12px_4px_12px_12px] bg-forest px-3.5 py-2.5 text-sm leading-[1.65] whitespace-pre-line text-surface">
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
              {state.pending && (
                <div
                  role="status"
                  aria-label="Assistant is typing"
                  className="flex max-w-[86%] items-center gap-1.5 self-start border border-ink/15 bg-fog px-3.5 py-3.5"
                >
                  <span className="size-1.5 animate-bounce rounded-full bg-moss [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-moss [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-moss" />
                </div>
              )}
            </div>

            <div className="flex flex-none flex-col gap-2.5 border-t border-ink/15 px-3 pt-3 pb-3.5">
              {atWelcome && (
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((q) => (
                    <button
                      key={q.key}
                      type="button"
                      onClick={q.onClick}
                      className={quickReplyClass}
                    >
                      {q.label}
                    </button>
                  ))}
                  <BookingDialog>
                    <button type="button" className={quickReplyClass}>
                      Book an appointment
                    </button>
                  </BookingDialog>
                </div>
              )}
              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <input
                  value={state.input}
                  onChange={(e) =>
                    setState((s) => ({ ...s, input: e.target.value }))
                  }
                  placeholder={"Type your question…"}
                  aria-label="Message"
                  className="min-h-11 min-w-0 flex-1 border border-ink/30 bg-paper px-3 py-3 text-sm text-ink"
                />
                <button
                  type="submit"
                  disabled={state.pending}
                  className="h-11 flex-none border border-pine px-4 text-[15px] font-bold text-pine hover:bg-pine/10 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openChat()}
            className="flex min-h-13 items-center gap-2.5 border border-pine bg-forest px-5 py-3.5 text-base font-bold whitespace-nowrap text-surface shadow-launcher hover:bg-ink"
          >
            <span className="size-2 rounded-full bg-gold" />
            Chat with us
          </button>
        )}
      </div>
    </ChatContext.Provider>
  );
}

export function ChatTrigger({
  intent,
  className,
  children,
}: {
  intent?: ChatIntent;
  className?: string;
  children: ReactNode;
}) {
  const openChat = useChat();
  return (
    <button
      type="button"
      onClick={() => openChat(intent)}
      className={className}
    >
      {children}
    </button>
  );
}
