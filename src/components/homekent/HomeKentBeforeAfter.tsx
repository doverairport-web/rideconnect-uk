import Image from "next/image";

export function HomeKentBeforeAfter() {
  return (
    <section className="bg-homekent-cream py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-homekent-navy/10">
          <Image
            src="/homekent/before-after.png"
            alt="Before and after cleaning results — kitchen, living room and bathroom transformations by HomeKent"
            width={1024}
            height={682}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </div>
      </div>
    </section>
  );
}
