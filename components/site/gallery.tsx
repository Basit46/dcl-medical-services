import Image from "next/image";

type GalleryItem = {
  title: string;
  category: string;
  alt: string;
  src: string;
  objectPosition?: string;
};

const galleryItems: GalleryItem[] = [
  {
    title: "Our hospital",
    category: "The facility",
    alt: "Exterior of DCL Medical Services",
    src: "/hosptal1-potrait.jpeg",
  },
  {
    title: "Our hospital",
    category: "The facility",
    alt: "Exterior of DCL Medical Services",
    src: "/hosptal2-potrait.jpeg",
  },
  {
    title: "Our hospital",
    category: "Preview of HMOs",
    alt: "Interior of DCL Medical Services",
    src: "/dcl-hmo.webp",
  },
];

function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <article className="group relative min-h-[380px] overflow-hidden rounded-2xl border border-primary-200/70 bg-white shadow-plate transition-shadow duration-300 hover:shadow-panel lg:min-h-[420px]">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ objectPosition: item.objectPosition ?? "center" }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-primary-900/90 via-primary-900/15 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-6">
        <p className="m-0 mb-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-primary-100">
          {item.category}
        </p>
        <h3 className="m-0 font-display text-2xl font-normal text-white sm:text-[28px]">
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
              Our spaces
            </h2>
          </div>
          <p className="m-0 max-w-[38ch] text-[15px] leading-[1.7] text-primary-800">
            A glimpse of our hospital and the spaces where we look after our
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[420px] lg:grid-cols-3">
          {galleryItems.map((item) => (
            <GalleryCard key={item.src} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
