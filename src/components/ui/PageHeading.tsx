export default function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-[75rem] px-5 pt-12 pb-8 text-center">
      <h1 className="text-3xl font-bold text-[#001A23] sm:text-4xl">{title}</h1>
      <div className="mx-auto mt-3 h-1 w-32 rounded bg-yellow-400" />
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-gray-600">{subtitle}</p>}
    </div>
  );
}
