export default function Fig({ n, label }: { n: number; label: string }) {
  return (
    <header className="fig">
      <span>Fig {n}</span>
      <span>{label}</span>
    </header>
  );
}
