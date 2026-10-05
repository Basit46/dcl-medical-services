export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; url: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: { url: string };
  body: ArticleBlock[];
  portableBody?: unknown[];
};

export const articles: Article[] = [
  {
    slug: "welcome-to-dcl-medical-services",
    title: "Welcome to DCL Medical Services",
    excerpt:
      "Established as Deji Clinic Ltd in 1985, DCL Medical Services provides primary and secondary care from its Ketu and Iju-Ishaga units.",
    publishedAt: "2026-10-04",
    body: [
      {
        type: "paragraph",
        text: "DCL Medical Services was established as Deji Clinic Ltd in January 1985. Today, the clinic serves its communities from two units in Lagos: one in Ketu and one in Iju-Ishaga.",
      },
      { type: "heading", text: "Primary and secondary care" },
      {
        type: "paragraph",
        text: "The clinic is a general practice providing primary and secondary care. Its services include outpatient treatment, admissions, surgeries, maternity care, immunisation, wellness and health checks, counselling, laboratory services, ultrasound, and physiotherapy.",
      },
      { type: "heading", text: "Serving different clients" },
      {
        type: "paragraph",
        text: "DCL Medical Services serves cash-paying clients, HMO members, and retainer clients. More than 70 HMO plans are accepted at the clinic’s units.",
      },
      {
        type: "paragraph",
        text: "The clinic describes its approach as customer-friendly service delivered by a motivated, courteous, and professional workforce.",
      },
    ],
  },
  {
    slug: "our-ketu-and-iju-ishaga-units",
    title: "Our Ketu and Iju-Ishaga units",
    excerpt:
      "Find the Ketu and Iju-Ishaga addresses, contact numbers, and the clinic schedules provided by DCL Medical Services.",
    publishedAt: "2026-10-04",
    body: [
      {
        type: "paragraph",
        text: "DCL Medical Services operates two units in Lagos. Contact the unit most convenient for you using the details below.",
      },
      { type: "heading", text: "Ketu" },
      {
        type: "paragraph",
        text: "The Ketu unit is at 5 Doyin Omololu Street, off Demurin Street, Ketu, Lagos. Call 0706 713 1613.",
      },
      { type: "heading", text: "Iju-Ishaga" },
      {
        type: "paragraph",
        text: "The Iju-Ishaga unit is at 56 Agbado Road, Tokotaya bus stop, Iju-Ishaga, Lagos. Call 0706 713 1611.",
      },
      { type: "heading", text: "General and antenatal clinics" },
      {
        type: "paragraph",
        text: "General clinics operate 24 hours daily. Antenatal clinic registration is available any day.",
      },
      { type: "heading", text: "Scheduled clinics" },
      {
        type: "list",
        items: [
          "ENT clinic: third week of the month.",
          "Orthopaedic clinic: last Friday of the month at 9:00 am.",
          "Gynaecology clinic: first and third Tuesday of the month at 2:30 pm.",
          "Physiotherapy at Ketu: Mondays and Fridays, 11:00 am–4:00 pm.",
          "Physiotherapy at Iju-Ishaga: Tuesdays and Thursdays, 12:00 noon–4:00 pm.",
        ],
      },
      {
        type: "paragraph",
        text: "Urology consultation, neurology, and psychiatry are listed as non-scheduled clinics. Contact the hospital team to arrange an appointment.",
      },
    ],
  },
  {
    slug: "keeping-in-touch-with-the-clinic",
    title: "Keeping in touch with the clinic",
    excerpt:
      "An overview of the outpatient, inpatient, maternity, diagnostic, wellness, and rehabilitation services offered by the clinic.",
    publishedAt: "2026-10-04",
    body: [
      {
        type: "paragraph",
        text: "DCL Medical Services provides a range of primary and secondary care services across its Ketu and Iju-Ishaga units. The list below reflects the services published by the clinic.",
      },
      { type: "heading", text: "Treatment and hospital care" },
      {
        type: "list",
        items: [
          "Outpatient treatment for primary and secondary care.",
          "Admission services for patients who need hospital care.",
          "Surgical services.",
          "Maternity services.",
          "Immunisation services.",
        ],
      },
      { type: "heading", text: "Checks, diagnostics, and rehabilitation" },
      {
        type: "list",
        items: [
          "Wellness services, health check-ups, and counselling.",
          "Laboratory services.",
          "Ultrasound services.",
          "Physiotherapy services.",
        ],
      },
      {
        type: "paragraph",
        text: "The clinic welcomes cash-paying clients, HMO members, and retainer clients. For current clinic schedules or to confirm details for a specific unit, contact the hospital team directly.",
      },
    ],
  },
];
