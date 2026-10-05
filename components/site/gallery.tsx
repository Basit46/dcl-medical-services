import Image from "next/image";
import {
  Building2,
  HeartPulse,
  ImagePlus,
  Microscope,
  Stethoscope,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type GalleryItem = {
  title: string;
  category: string;
  alt: string;
  icon: LucideIcon;
  background: string;
  featured?: boolean;
  src?: string;
};

const galleryItems: GalleryItem[] = [
  {
    title: "Our hospital",
    category: "The facility",
    alt: "DCL Medical Services hospital",
    icon: Building2,
    background: "from-white via-white to-white",
    featured: true,
  },
  {
    title: "Nurses & care team",
    category: "Our people",
    alt: "DCL Medical Services nurses and care team",
    icon: UsersRound,
    background: "from-white via-white to-white",
  },
  {
    title: "Patient care",
    category: "Everyday care",
    alt: "Care being provided at DCL Medical Services",
    icon: HeartPulse,
    background: "from-white via-white to-white",
  },
  {
    title: "Our clinical spaces",
    category: "Inside the clinic",
    alt: "Clinical spaces at DCL Medical Services",
    icon: Stethoscope,
    background: "from-white via-white to-white",
  },
  {
    title: "Laboratory & ultrasound",
    category: "Our services",
    alt: "Laboratory and ultrasound facilities",
    icon: Microscope,
    background: "from-white via-white to-white",
  },
];

function GalleryCard({ item }: { item: GalleryItem }) {
  const Icon = item.icon;

  return (
    <article
      className={`group relative min-h-[250px] overflow-hidden rounded-2xl border border-primary-200/70 bg-white shadow-plate transition-shadow duration-300 hover:shadow-panel ${
        item.featured
          ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:min-h-[390px]"
          : ""
      }`}
    >
      {item.src ? (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`absolute inset-0 overflow-hidden bg-linear-to-br ${item.background}`}
        >
          <div className="absolute -top-16 -right-16 size-64 rounded-full border border-primary-200/70" />
          <div className="absolute -top-7 -right-7 size-44 rounded-full bg-white/70 blur-2xl" />
          <div className="absolute -bottom-24 -left-12 size-64 rounded-full bg-primary-100/50 blur-3xl" />
          <div className="absolute inset-0 flex items-center justify-center text-primary-600/45 transition-transform duration-700 group-hover:scale-110">
            <Icon size={item.featured ? 92 : 68} strokeWidth={1.15} />
          </div>
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 border border-primary-100 bg-white/90 px-3 py-2 text-[10px] font-bold tracking-[0.14em] text-primary-700 uppercase backdrop-blur-sm">
            <ImagePlus size={14} strokeWidth={1.8} />
            Photo slot
          </div>
        </div>
      )}

      {item.src && (
        <div className="absolute inset-0 bg-linear-to-t from-primary-900/90 via-primary-900/15 to-transparent" />
      )}
      <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-6">
        <p
          className={`m-0 mb-1.5 text-[10px] font-bold tracking-[0.2em] uppercase ${item.src ? "text-primary-100" : "text-primary-600"}`}
        >
          {item.category}
        </p>
        <h3
          className={`m-0 font-display text-2xl font-normal sm:text-[28px] ${item.src ? "text-white" : "text-primary-900"}`}
        >
          {item.title}
        </h3>
      </div>
    </article>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className="border-y border-primary-100 bg-white">
      <div className="mx-auto max-w-[1250px] px-5 py-14 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
          <div>
            <span className="mb-2 block text-[11px] font-bold tracking-[0.2em] text-primary-600 uppercase">
              Inside DCL Medical Services
            </span>
            <h2 className="m-0 font-display text-4xl font-normal tracking-[-0.02em] text-primary-900 sm:text-5xl">
              Our people & spaces
            </h2>
          </div>
          <p className="m-0 max-w-[38ch] text-[15px] leading-[1.7] text-primary-800">
            A glimpse of our hospital, care team and the spaces where we look
            after our community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[190px] lg:grid-cols-4">
          {galleryItems.map((item) => (
            <GalleryCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
