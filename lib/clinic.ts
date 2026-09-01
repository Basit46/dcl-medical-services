export const clinic = {
  name: "DCL Medical Services",
  legalName: "Deji Clinic Ltd",
  familiarName: "Deji Clinic",
  tagline: "We Care, God Heals",
  established: 2005,
  email: "dejiclinic2005@yahoo.com",
  directorLine: { label: "0803 307 2123", href: "tel:08033072123" },
  openingHours:
    "Monday to Saturday, 8:00am – 8:00pm. Sundays, 10:00am – 6:00pm. Emergencies and maternity are attended to 24 hours at both branches.",
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
  description:
    "Family clinic in Ketu and Iju Ishaga, Lagos. General practice, maternity, lab, scan and surgery under one roof — with over 70 HMO plans accepted at both branches.",
} as const;

export type Branch = {
  id: string;
  index: string;
  name: string;
  address: string;
  tel: { label: string; href: string };
  whatsapp: string;
  position: [number, number];
};

export const branches: Branch[] = [
  {
    id: "ketu",
    index: "Branch 01",
    name: "Ketu",
    address: "5 Doyin Omololu Street, Ketu, Lagos",
    tel: { label: "0706 713 1613", href: "tel:07067131613" },
    whatsapp: "2347067131613",
    position: [6.6016, 3.3862],
  },
  {
    id: "iju",
    index: "Branch 02",
    name: "Iju Ishaga",
    address: "56 Agbado Road, Tokotaya bus stop, Iju Ishaga, Lagos",
    tel: { label: "0706 713 1611", href: "tel:07067131611" },
    whatsapp: "2347067131611",
    position: [6.6659, 3.3247],
  },
];

export const services = [
  { num: "01", name: "General Practice", desc: "Day-to-day consultation, treatment and follow-up for adults and children." },
  { num: "02", name: "Maternity", desc: "Antenatal care, delivery and postnatal checks with resident midwives." },
  { num: "03", name: "Scan", desc: "Ultrasound scans including obstetric, abdominal and pelvic." },
  { num: "04", name: "Lab", desc: "On-site laboratory for blood work, cultures and routine screening." },
  { num: "05", name: "Surgery", desc: "Minor and general surgical procedures in our theatre." },
  { num: "06", name: "Orthopaedics", desc: "Bone, joint and injury care, from fractures to chronic pain." },
  { num: "07", name: "Gynaecology", desc: "Women's health, from routine checks to specialist referral." },
  { num: "08", name: "Urology", desc: "Kidney, bladder and prostate assessment and treatment." },
  { num: "09", name: "ENT", desc: "Ear, nose and throat consultation for all ages." },
  { num: "10", name: "Physiotherapy", desc: "Rehabilitation after injury, surgery or stroke." },
  { num: "11", name: "General Consult", desc: "Talk through a concern with a doctor before deciding on care." },
];

export const hmoPlans = [
  "AXA Mansard",
  "Leadway Assurance",
  "Clearline",
  "Hygeia HMO",
  "HCI Healthcare",
  "Healthcare Security Limited",
  "Clearline International",
  "Princeton Health",
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
    who: "Bisi A. · Maternity",
  },
];

export const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#hmo", label: "HMOs" },
  { href: "#director", label: "Director" },
  { href: "#testimonials", label: "Patients" },
  { href: "#locations", label: "Locations" },
  { href: "#contact", label: "Contact" },
];

export const callBothBranches = "Ketu 0706 713 1613, Iju 0706 713 1611";
