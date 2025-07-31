import { Progress } from "@/components/ui/progress";

interface ResilienceIndicatorProps {
  label: string;
  count: number;
  percent: number;
  total: number;
  variant: 'low' | 'medium' | 'high';
}

export function ResilienceIndicator({ 
  label, 
  count, 
  percent, 
  total, 
  variant 
}: ResilienceIndicatorProps) {
  const getVariantColors = (variant: 'low' | 'medium' | 'high') => {
    switch (variant) {
      case 'low':
        return {
          bg: 'bg-green-900/20 border-green-800',
          text: 'text-green-400',
          progress: 'progress-green'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-900/20 border-yellow-800',
          text: 'text-yellow-400',
          progress: 'progress-yellow'
        };
      case 'high':
        return {
          bg: 'bg-red-900/20 border-red-800',
          text: 'text-red-400',
          progress: 'progress-red'
        };
    }
  };

  const colors = getVariantColors(variant);

  return (
    <div className={`p-4 rounded-xl border ${colors.bg}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className={`font-semibold font-['Inter'] ${colors.text}`}>{label}</h4>
        <span className={`text-lg font-mono font-bold ${colors.text}`}>
          {percent.toFixed(1)}%
        </span>
      </div>
      
      <div className="space-y-3">
        <Progress 
          value={percent} 
          className={`h-3 ${colors.progress}`}
        />
        
        <div className="flex justify-between text-sm text-[#a1a1aa] font-['Inter']">
          <span className="font-medium">{count.toLocaleString()} people</span>
          <span>of {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
