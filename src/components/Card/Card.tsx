import './Card.css';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={`card ${className || ''}`}>{children}</section>;
}
