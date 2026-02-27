interface StrengthMeterProps {
  score: 0 | 1 | 2 | 3 | 4;
}

const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const colors = [
  'bg-red-500',
  'bg-red-500',
  'bg-amber-500',
  'bg-yellow-400',
  'bg-green-500',
];

export default function StrengthMeter({ score }: StrengthMeterProps) {
  return (
    <div className="mt-2">
      <div className="flex gap-1 h-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-colors duration-300 ${
              i < score ? colors[score] : 'bg-[#334155]'
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs font-medium" style={{ color: score >= 3 ? '#22c55e' : score === 2 ? '#f59e0b' : '#ef4444' }}>
        {score > 0 ? labels[score] : 'Enter a password'}
      </p>
    </div>
  );
}
