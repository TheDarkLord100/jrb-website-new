export default function SectionHeading({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8 text-center">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl font-bold text-[#001A23] sm:text-3xl">{title}</h2>
      <div className="mx-auto mt-3 h-0.5 w-16 rounded bg-amber-400" />
    </div>
  );
}