import './Option.css';

export function Option({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="option" onClick={onClick}>
      {label}
    </button>
  );
}
