export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-1">
      <p className="label">{eyebrow}</p>
      <h1 className="text-2xl font-black text-ink sm:text-3xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-6 text-ink/65">{description}</p>
    </div>
  );
}
