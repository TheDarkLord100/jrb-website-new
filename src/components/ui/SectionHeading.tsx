export default function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-[#001A23] sm:text-3xl">{title}</h2>
      <div className="mx-auto mt-3 h-1 w-20 rounded bg-yellow-400" />
    </div>
  );
}
