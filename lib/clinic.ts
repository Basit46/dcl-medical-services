export const clinic = {
  name: "DCL Medical Services",
  legalName: "Deji Clinic Ltd",
  familiarName: "Deji Clinic",
  tagline: "We Care, God Heals",
  established: 1985,
  establishedMonth: "January",
  careDescription:
    "General practice providing primary and secondary care at our hospitals in Ketu and Iju-Ishaga, Lagos.",
  clientTypes: ["Cash-paying clients", "HMO members", "Retainers"],
  workforceDescription:
    "Customer-friendly services from a motivated, courteous and professional workforce.",
  email: "dejiclinic2005@yahoo.com",
  directorLine: { label: "0803 307 2123", href: "tel:08033072123" },
  openingHours:
    "Open 24 hours a day, 7 days a week at both branches — including emergencies and maternity.",
  hmoCount: "70+",
} as const;

export const director = {
  name: "Dr. Olawore Ayodeji",
  role: "Medical Director",
  bio: "Dr. Olawore Ayodeji is the Medical Director and owner of Deji Clinic Ltd, and heads the clinical team across both branches.",
  note: "He continues to see patients himself, and the standard he sets at the consulting room door is the one the whole clinic works to.",
} as const;

export const site = {
  url: "https://dcl-medical-services.vercel.app",
  locale: "en_NG",
  title: "DCL Medical Services (Deji Clinic) — Hospital in Ketu, Lagos",
  description:
    "DCL Medical Services, formerly Deji Clinic, is a 24-hour hospital in Ketu and Iju-Ishaga, Lagos. Maternity, lab, ultrasound, physiotherapy and 70+ HMO plans accepted.",
  areasServed: ["Ketu", "Alapere", "Ogudu", "Iju Ishaga", "Agbado", "Lagos"],
  keywords: [
    "hospital in Ketu",
    "hospitals in Ketu",
    "best hospital in Ketu",
    "hospital in Alapere",
    "hospital near Alapere",
    "hospital in Iju Ishaga",
    "hospitals in Iju Ishaga",
    "hospital in Lagos",
    "hospitals in Lagos",
    "Deji Clinic",
    "Deji Clinic Ketu",
    "Deji Clinic Lagos",
    "DCL Medical Services",
    "HMO accepted hospitals",
    "hospital that accepts HMO in Lagos",
    "HMO hospital Ketu",
    "HMO hospital Iju Ishaga",
    "24 hour hospital Lagos",
    "24 hour clinic Ketu",
    "maternity hospital Lagos",
    "antenatal clinic Ketu",
    "general hospital Ketu",
    "private hospital Lagos",
    "clinic in Ketu",
    "clinic in Iju Ishaga",
    "medical laboratory Lagos",
    "ultrasound scan Lagos",
    "physiotherapy Lagos",
    "immunisation clinic Lagos",
    "hospital offering service in Ketu Alapere Iju Ishaga",
  ],
} as const;

export type Branch = {
  id: string;
  index: string;
  name: string;
  address: string;
  postcode: string;
  tel: { label: string; href: string };
  whatsapp: string;
  position: [number, number];
};

export const branches: Branch[] = [
  {
    id: "ketu",
    index: "Branch 01",
    name: "Ketu",
    address: "5 Doyin Omololu Street, off Demurin street, Ketu, Lagos",
    postcode: "LA 13 A19 EL 14",
    tel: { label: "0706 713 1613", href: "tel:07067131613" },
    whatsapp: "2347067131613",
    position: [6.6016, 3.3862],
  },
  {
    id: "iju",
    index: "Branch 02",
    name: "Iju Ishaga",
    address: "56 Agbado Road, Tokotaya bus stop, Iju Ishaga, Lagos",
    postcode: "LA 10 A12 KB 07",
    tel: { label: "0706 713 1611", href: "tel:07067131611" },
    whatsapp: "2347067131611",
    position: [6.6659, 3.3247],
  },
];

export const services = [
  {
    num: "01",
    name: "Outpatient Treatment Services",
    desc: "Primary and secondary care without hospital admission.",
  },
  {
    num: "02",
    name: "Admission Services",
    desc: "Inpatient care when treatment requires a hospital stay.",
  },
  {
    num: "03",
    name: "Surgeries",
    desc: "Surgical procedures as part of the clinic's care offering.",
  },
  {
    num: "04",
    name: "Maternity Services",
    desc: "Support and clinical care for maternity patients.",
  },
  {
    num: "05",
    name: "Immunisation Services",
    desc: "Vaccination services for patients.",
  },
  {
    num: "06",
    name: "Wellness & Health Checks",
    desc: "Preventive check-ups and counselling services.",
  },
  {
    num: "07",
    name: "Laboratory Services",
    desc: "Clinical testing to support diagnosis and care.",
  },
  {
    num: "08",
    name: "Ultrasound Services",
    desc: "Ultrasound imaging for clinical assessment.",
  },
  {
    num: "09",
    name: "Physiotherapy Services",
    desc: "Physiotherapy care to support movement and rehabilitation.",
  },
];

export const clinicSchedules = [
  { name: "General Clinics", details: "24 hours daily" },
  { name: "Antenatal Clinic", details: "Registration available any day" },
  { name: "ENT Clinic", details: "Third week of the month" },
  {
    name: "Orthopaedic Clinic",
    details: "Last Friday of the month at 9:00 am",
  },
  {
    name: "Gynaecology Clinic",
    details: "First and third Tuesday of the month at 2:30 pm",
  },
  {
    name: "Physiotherapy Clinic — Ketu",
    details: "Mondays and Fridays, 11:00 am–4:00 pm",
  },
  {
    name: "Physiotherapy Clinic — Iju-Ishaga",
    details: "Tuesdays and Thursdays, 12:00 noon–4:00 pm",
  },
];

export const labOpeningHours = [
  {
    branch: "Ketu",
    hours: [
      { days: "Monday–Friday", time: "8:00 am–9:00 pm" },
      { days: "Saturday", time: "10:00 am–2:00 pm" },
      { days: "Sunday", time: "4:00 pm–9:00 pm" },
    ],
  },
  {
    branch: "Iju-Ishaga",
    hours: [
      { days: "Monday–Friday", time: "8:00 am–5:00 pm" },
      { days: "Saturday", time: "9:00 am–1:00 pm" },
    ],
    note: "",
  },
];

export const appointmentClinics = [
  "Urology Consultation",
  "Neurology",
  "Psychiatry",
];

export const hmoPlans = [
  "AXA Mansard",
  "Ally Healthcare",
  "Altuhealth",
  "Aspire HMO",
  "Avilia",
  "Avon",
  "Bastion",
  "Century Aid",
  "CK Line",
  "Clearline",
  "Crown Jewel HMO",
  "DeLog",
  "Dependable HMO",
  "DOT",
  "Eko Hotel",
  "Fountain",
  "GBolly",
  "GNI",
  "Gorah",
  "GreenBay",
  "GreenShield",
  "Grooming",
  "Hadiel",
  "Hallmark",
  "Havana Beverages",
  "HCI Healthcare",
  "HCI International",
  "HealthSpring",
  "Healthcare Security Limited",
  "Hygeia HMO",
  "Kennedia",
  "Leadway Assurance",
  "Liberty Blue",
  "Life Action",
  "Life Link",
  "Lifesaver",
  "Lifeworth (including NYSC)",
  "Masslife",
  "MBO",
  "Medexia",
  "Mediplan / Wellness",
  "MultiShield",
  "NEM HMO",
  "NHIS",
  "NNPC",
  "Noor HMO",
  "Novo Health",
  "Oceanic",
  "Phillips",
  "Princeton Health",
  "Pro Health",
  "Quest",
  "Redcare",
  "Regenix",
  "Reliance",
  "Ronsberger",
  "Rothauge",
  "Serene",
  "SMAT Health",
  "Springtide",
  "SUNU",
  "THT",
  "Venus / Zenith",
  "Veritas",
  "WOOT HMO",
  "Zenor",
];

export const testimonials = [
  {
    quote:
      "I have brought my children here since 2011. The doctors listen, they explain what is wrong, and they do not rush you out of the room.",
    who: "Mrs. F. Adeyemi · Ketu branch",
  },
  {
    quote:
      "My HMO was accepted without any argument at the desk. I was seen within twenty minutes and the lab results came back the same day.",
    who: "Emeka O. · Iju Ishaga branch",
  },
  {
    quote:
      "I delivered both of my babies at Deji Clinic. The midwives stayed with me through the night. I could not have asked for better care.",
    who: "Bisi A. · Ketu branch",
  },
];

export const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#hmo", label: "HMOs" },
  { href: "#gallery", label: "Gallery" },
  { href: "#testimonials", label: "Patients" },
  { href: "#locations", label: "Locations" },
  { href: "#contact", label: "Contact" },
];

export const callBothBranches = "Ketu 0706 713 1613, Iju 0706 713 1611";
