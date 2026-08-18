interface SectionLabelProps {
  children: string;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`label-mono inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="inline-block w-6 h-px bg-signal/60" aria-hidden="true" />
      {children}
    </span>
  );
}
