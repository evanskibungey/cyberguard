import RiskBadge from './RiskBadge';

type RiskLevel = 'safe' | 'suspicious' | 'danger' | 'unknown';

interface ResultCardProps {
  level: RiskLevel;
  title: string;
  details?: { label: string; value: string }[];
  children?: React.ReactNode;
}

const icons: Record<RiskLevel, string> = {
  safe: '✅',
  suspicious: '⚠️',
  danger: '🚨',
  unknown: '❓',
};

export default function ResultCard({ level, title, details, children }: ResultCardProps) {
  const borderColor: Record<RiskLevel, string> = {
    safe: 'border-green-700',
    suspicious: 'border-amber-700',
    danger: 'border-red-700',
    unknown: 'border-slate-600',
  };

  return (
    <div className={`bg-[#1e293b] border ${borderColor[level]} rounded-xl p-6 mt-6`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icons[level]}</span>
        <div>
          <p className="text-slate-400 text-sm">Scan Result</p>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
        <div className="ml-auto">
          <RiskBadge level={level} />
        </div>
      </div>

      {details && details.length > 0 && (
        <dl className="mt-4 space-y-2">
          {details.map((item) => (
            <div key={item.label} className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-slate-400 text-sm w-36 shrink-0">{item.label}</dt>
              <dd className="text-slate-200 text-sm break-all">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
