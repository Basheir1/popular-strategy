import React, { forwardRef } from 'react';
import { Badge } from './ui/badge';

interface TipCardProps {
  year: string;
  stockSymbol?: string;
  thesis: string;
  sentiment: 'bullish' | 'bearish';
  metrics: {
    label: string;
    value: string;
  }[];
  isSelected?: boolean;
  onClick?: () => void;
  tabIndex?: number;
  ariaSelected?: boolean;
}

export const TipCard = forwardRef<HTMLDivElement, TipCardProps>(({ 
  year,
  stockSymbol,
  thesis, 
  sentiment,
  metrics, 
  isSelected, 
  onClick,
  tabIndex = -1,
  ariaSelected = false
}, ref) => {
  return (
    <div 
      ref={ref}
      onClick={onClick}
      role="listitem"
      tabIndex={tabIndex}
      aria-selected={ariaSelected}
      className={`
        p-2 mb-1.5 rounded-lg border cursor-pointer transition-colors
        ${isSelected 
          ? 'bg-white border-red-500' 
          : 'bg-[#fafafa] border-gray-200 hover:bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <div className="text-[10px] text-red-600 tracking-wide">{year}</div>
          {stockSymbol && (
            <>
              <div className="text-[10px] text-gray-400">•</div>
              <div className="text-[10px] text-gray-700">{stockSymbol}</div>
            </>
          )}
        </div>
        <Badge 
          variant={sentiment === 'bullish' ? 'default' : 'destructive'}
          className={`h-4 px-1.5 text-[9px] ${
            sentiment === 'bullish' 
              ? 'bg-green-100 text-green-700 hover:bg-green-100' 
              : ''
          }`}
        >
          {sentiment === 'bullish' ? 'BULLISH' : 'BEARISH'}
        </Badge>
      </div>
      <p className="text-xs text-gray-700 mb-1.5 line-clamp-2 leading-snug">{thesis}</p>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-baseline justify-between">
            <span className="text-gray-500">{metric.label}</span>
            <span className="text-gray-900">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

TipCard.displayName = 'TipCard';
