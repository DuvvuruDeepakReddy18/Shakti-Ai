export default function LoadingSpinner({ size = 'lg', text = '' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-4 border-[var(--color-shakti-dark-border)] border-t-[var(--color-shakti-primary)] animate-spin`} />
      </div>
      {text && <p className="text-sm text-[var(--color-shakti-dark-muted)] animate-pulse">{text}</p>}
    </div>
  );
}
