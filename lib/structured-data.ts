import { branches, clinic, director, services, site } from "@/lib/clinic";

const openingHours = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "20:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Sunday",
    opens: "10:00",
    closes: "18:00",
  },
];

export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${site.url}/#clinic`,
    name: clinic.name,
    alternateName: [clinic.familiarName, clinic.legalName],
    url: site.url,
    description: site.description,
    slogan: clinic.tagline,
    email: clinic.email,
    foundingDate: String(clinic.established),
    image: `${site.url}/opengraph-image`,
    priceRange: "$$",
    currenciesAccepted: "NGN",
    isAcceptingNewPatients: true,
    medicalSpecialty: [
      "PrimaryCare",
      "Obstetric",
      "Gynecologic",
      "Surgical",
      "Orthopedic",
      "Urologic",
      "Otolaryngologic",
      "Physiotherapy",
    ],
    availableService: services.map((service) => ({
      "@type": "MedicalProcedure",
      name: service.name,
      description: service.desc,
    })),
    employee: {
      "@type": "Physician",
      name: director.name,
      jobTitle: director.role,
    },
    sameAs: ["https://facebook.com/Dejiclinic", "https://instagram.com/Dejiclinic"],
    openingHoursSpecification: openingHours,
    department: branches.map((branch) => ({
      "@type": "MedicalClinic",
      "@id": `${site.url}/#${branch.id}`,
      name: `${clinic.name} — ${branch.name}`,
      telephone: `+234${branch.tel.label.replace(/\D/g, "").slice(1)}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: branch.address.split(", Lagos")[0],
        addressLocality: branch.name,
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: branch.position[0],
        longitude: branch.position[1],
      },
      openingHoursSpecification: openingHours,
    })),
  };
}
