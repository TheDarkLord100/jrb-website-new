export default function PageHeading({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mx-auto max-w-[75rem] px-5 pt-16 pb-10 text-center">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-3xl font-bold text-[#001A23] sm:text-4xl">{title}</h1>
      <div className="mx-auto mt-3 h-0.5 w-16 rounded bg-amber-400" />
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-gray-600">{subtitle}</p>}
    </div>
  );
}