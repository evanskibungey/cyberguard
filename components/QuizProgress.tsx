interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-slate-400 mb-2">
        <span>Question {current} of {total}</span>
        <span>{percent}% complete</span>
      </div>
      <div className="w-full bg-[#1e293b] rounded-full h-2">
        <div
          className="bg-[#0ea5e9] h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
