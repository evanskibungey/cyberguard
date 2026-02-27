type RiskLevel = 'safe' | 'suspicious' | 'danger' | 'unknown';

interface RiskBadgeProps {
  level: RiskLevel;
}

const config: Record<RiskLevel, { label: string; className: string }> = {
  safe: {
    label: 'Safe',
    className: 'bg-green-900/50 text-green-400 border border-green-700',
  },
  suspicious: {
    label: 'Suspicious',
    className: 'bg-amber-900/50 text-amber-400 border border-amber-700',
  },
  danger: {
    label: 'Danger',
    className: 'bg-red-900/50 text-red-400 border border-red-700',
  },
  unknown: {
    label: 'Unknown',
    className: 'bg-slate-700/50 text-slate-400 border border-slate-600',
  },
};

export default function RiskBadge({ level }: RiskBadgeProps) {
  const { label, className } = config[level];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${className}`}>
      {level === 'safe' && '✓ '}
      {level === 'danger' && '✕ '}
      {level === 'suspicious' && '⚠ '}
      {level === 'unknown' && '? '}
      {label}
    </span>
  );
}
