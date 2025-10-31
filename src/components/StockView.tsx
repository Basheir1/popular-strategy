import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown, ThumbsUp, Minus, ThumbsDown, StickyNote, ArrowUpRight, ArrowDownRight, BookOpen, Edit2, DollarSign, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface Position {
  openQty: number;
  avgCost: number;
  valuation: number;
  unrealizedPL: number;
  realizedPL: number;
  winRate: number;
}

interface Conviction {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  level: 'high' | 'medium' | 'low';
  targetPrice: string;
  rationale: string;
}

interface StockViewProps {
  stockSymbol: string;
  stockName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  position: Position | null;
  tips: Array<{
    id: string;
    year: string;
    title: string;
    thesis: string;
    evidence: string;
    metricsTable: {
      metric: string;
      value: string;
      change: string;
    }[];
  }>;
  assessments: Record<string, 'agree' | 'neutral' | 'disagree' | null>;
  onAssessmentChange: (tipId: string, assessment: 'agree' | 'neutral' | 'disagree' | null) => void;
  onBack: () => void;
  onNotesClick?: () => void;
  onTipVisible?: (tipId: string) => void;
  onJournalClick?: () => void;
  onPostClick?: (tipId: string) => void;
}

export const StockView: React.FC<StockViewProps> = ({
  stockSymbol,
  stockName,
  currentPrice,
  priceChange,
  priceChangePercent,
  position,
  tips,
  assessments,
  onAssessmentChange,
  onBack,
  onNotesClick,
  onTipVisible,
  onJournalClick,
  onPostClick
}) => {
  const [expandedThesis, setExpandedThesis] = useState<Record<string, boolean>>({});
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});
  const tipRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isEditingConviction, setIsEditingConviction] = useState(false);
  
  // Mock conviction data - in real app, this would be stored in a database
  const [conviction, setConviction] = useState<Conviction>({
    sentiment: 'bullish',
    level: 'high',
    targetPrice: '$185',
    rationale: 'Strong position with positive outlook'
  });

  const [editedConviction, setEditedConviction] = useState<Conviction>(conviction);

  const toggleThesis = (tipId: string) => {
    setExpandedThesis(prev => ({ ...prev, [tipId]: !prev[tipId] }));
  };

  const toggleEvidence = (tipId: string) => {
    setExpandedEvidence(prev => ({ ...prev, [tipId]: !prev[tipId] }));
  };

  // Scroll detection to sync with notes panel
  useEffect(() => {
    const handleScroll = () => {
      if (!onTipVisible) return;

      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const containerMid = containerRect.top + containerRect.height / 3;

      // Find which tip is most visible
      for (const tip of tips) {
        const element = tipRefs.current[tip.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < containerMid && rect.bottom > containerRect.top) {
            onTipVisible(tip.id);
            break;
          }
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [tips, onTipVisible]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const handleSaveConviction = () => {
    setConviction(editedConviction);
    setIsEditingConviction(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'bearish':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'neutral':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getConvictionColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 h-7 px-2 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        </div>
        
        {/* Mobile Notes Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNotesClick}
          className="md:hidden gap-1.5 h-7 px-2.5 text-xs text-green-600 border-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700 hover:border-green-700"
        >
          <StickyNote className="w-3.5 h-3.5" />
          Notes
        </Button>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="w-full">
          {/* Stock Header - Price and Position */}
          <div className="px-4 md:px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h1 className="text-3xl text-gray-900">{stockSymbol}</h1>
                  <span className="text-base text-gray-600">{stockName}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl text-gray-900">{formatCurrency(currentPrice)}</div>
                <div className={`text-sm flex items-center gap-1 justify-end ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{formatCurrency(Math.abs(priceChange))} ({formatPercent(priceChangePercent)})</span>
                </div>
              </div>
            </div>

            {/* Position Summary */}
            {position && (
              <div className="flex items-center justify-between">
                <Card className="flex-1 border-gray-200 shadow-sm">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs text-gray-600">Position Summary</h3>
                      {onJournalClick && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onJournalClick}
                          className="h-6 px-2 gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <BookOpen className="w-3 h-3" />
                          Journal
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-[10px] text-gray-500 mb-0.5">Open Qty</div>
                        <div className="text-base text-gray-900">{position.openQty}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 mb-0.5">Avg Cost</div>
                        <div className="text-base text-gray-900">{formatCurrency(position.avgCost)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 mb-0.5">Valuation</div>
                        <div className="text-base text-gray-900">{formatCurrency(position.valuation)}</div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Unrealized P&L</div>
                          <div className={`text-base ${position.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {position.unrealizedPL >= 0 ? '+' : ''}{formatCurrency(position.unrealizedPL)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Realized P&L</div>
                          <div className={`text-base ${position.realizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {position.realizedPL >= 0 ? '+' : ''}{formatCurrency(position.realizedPL)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Win Rate</div>
                          <div className="text-base text-gray-900">{position.winRate}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Current Conviction */}
            {position && (
              <div className="mt-4">
                <Card className="border-gray-200 shadow-sm">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs text-gray-600">Current Conviction</h3>
                      <Dialog open={isEditingConviction} onOpenChange={(open) => {
                        setIsEditingConviction(open);
                        if (open) {
                          setEditedConviction(conviction);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-base">Edit Conviction</DialogTitle>
                            <DialogDescription>
                              Edit your conviction sentiment, level, target price, and rationale for {stockSymbol}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {/* Sentiment */}
                            <div className="space-y-2">
                              <Label className="text-xs">Sentiment</Label>
                              <RadioGroup 
                                value={editedConviction.sentiment}
                                onValueChange={(value) => setEditedConviction(prev => ({
                                  ...prev,
                                  sentiment: value as 'bullish' | 'bearish' | 'neutral'
                                }))}
                                className="flex gap-2"
                              >
                                <div className="flex items-center">
                                  <RadioGroupItem value="bullish" id="edit-bullish" className="peer sr-only" />
                                  <Label
                                    htmlFor="edit-bullish"
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 cursor-pointer"
                                  >
                                    Bullish
                                  </Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="neutral" id="edit-neutral" className="peer sr-only" />
                                  <Label
                                    htmlFor="edit-neutral"
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-600 peer-data-[state=checked]:bg-gray-50 cursor-pointer"
                                  >
                                    Neutral
                                  </Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="bearish" id="edit-bearish" className="peer sr-only" />
                                  <Label
                                    htmlFor="edit-bearish"
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 cursor-pointer"
                                  >
                                    Bearish
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Conviction Level */}
                            <div className="space-y-2">
                              <Label className="text-xs">Conviction Level</Label>
                              <RadioGroup 
                                value={editedConviction.level}
                                onValueChange={(value) => setEditedConviction(prev => ({
                                  ...prev,
                                  level: value as 'high' | 'medium' | 'low'
                                }))}
                                className="flex gap-2"
                              >
                                <div className="flex items-center">
                                  <RadioGroupItem value="high" id="edit-high" className="peer sr-only" />
                                  <Label
                                    htmlFor="edit-high"
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                                  >
                                    High
                                  </Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="medium" id="edit-medium" className="peer sr-only" />
                                  <Label
                                    htmlFor="edit-medium"
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                                  >
                                    Medium
                                  </Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem value="low" id="edit-low" className="peer sr-only" />
                                  <Label
                                    htmlFor="edit-low"
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                                  >
                                    Low
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Target Price */}
                            <div className="space-y-2">
                              <Label htmlFor="editTargetPrice" className="text-xs">Target Price</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <Input
                                  id="editTargetPrice"
                                  value={editedConviction.targetPrice}
                                  onChange={(e) => setEditedConviction(prev => ({
                                    ...prev,
                                    targetPrice: e.target.value
                                  }))}
                                  placeholder="185"
                                  className="pl-8 h-8 text-xs"
                                />
                              </div>
                            </div>

                            {/* Rationale */}
                            <div className="space-y-2">
                              <Label htmlFor="editRationale" className="text-xs">Brief Rationale</Label>
                              <Textarea
                                id="editRationale"
                                value={editedConviction.rationale}
                                onChange={(e) => setEditedConviction(prev => ({
                                  ...prev,
                                  rationale: e.target.value
                                }))}
                                placeholder="e.g., strong AI market momentum"
                                className="min-h-[60px] resize-none text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditingConviction(false)}
                              className="h-8 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveConviction}
                              className="h-8 text-xs bg-red-600 hover:bg-red-700"
                            >
                              Save
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-900">{stockSymbol}</span>
                        <Badge className={`h-4 px-1.5 text-[10px] ${getSentimentColor(conviction.sentiment)}`}>
                          {conviction.sentiment.charAt(0).toUpperCase() + conviction.sentiment.slice(1)}
                        </Badge>
                      </div>
                      
                      {conviction.targetPrice && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                          <DollarSign className="w-3 h-3" />
                          <span>Target: {conviction.targetPrice}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <span className={getConvictionColor(conviction.level)}>
                          {conviction.level.charAt(0).toUpperCase() + conviction.level.slice(1)} Conviction
                        </span>
                      </div>
                      
                      {conviction.rationale && (
                        <p className="text-[10px] text-gray-700 italic mt-1">
                          "{conviction.rationale}"
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Tips List */}
          <div className="px-4 md:px-6 py-6 space-y-6">
            {tips.map((tip) => {
              const assessment = assessments[tip.id] || null;
              
              // Calculate if we need show more buttons
              const thesisLines = tip.thesis.split('\n').length;
              const evidenceLines = tip.evidence.split('\n').length;
              const shouldShowThesisToggle = thesisLines > 3 || tip.thesis.length > 200;
              const shouldShowEvidenceToggle = evidenceLines > 3 || tip.evidence.length > 200;
              const isThesisExpanded = expandedThesis[tip.id];
              const isEvidenceExpanded = expandedEvidence[tip.id];

              return (
                <div 
                  key={tip.id} 
                  ref={el => tipRefs.current[tip.id] = el}
                  className="scroll-mt-4"
                >
                  <Card className="shadow-sm border-gray-200">
                    {/* Tip Header - Title and Year */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h2 className="text-lg text-gray-900 leading-tight mb-1">{tip.title}</h2>
                          <div className="text-xs text-red-600 tracking-wide">{tip.year}</div>
                        </div>
                      </div>
                    </div>

                    {/* Tip Content */}
                    <div className="p-4 space-y-3">
                      {/* Thesis Summary */}
                      <div>
                        <h4 className="text-xs text-red-600 mb-2 tracking-wide">Thesis Summary</h4>
                        <p className={`text-sm text-gray-700 leading-relaxed ${!isThesisExpanded && shouldShowThesisToggle ? 'line-clamp-3' : ''}`}>
                          {tip.thesis}
                        </p>
                        {shouldShowThesisToggle && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleThesis(tip.id)}
                            className="mt-2 h-6 text-xs text-gray-600 hover:text-gray-900 p-0"
                          >
                            {isThesisExpanded ? 'Show Less' : 'Show More'}
                            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isThesisExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        )}
                      </div>

                      {/* Supporting Evidence */}
                      <div>
                        <h4 className="text-xs text-red-600 mb-2 tracking-wide">Supporting Evidence</h4>
                        <p className={`text-sm text-gray-700 leading-relaxed ${!isEvidenceExpanded && shouldShowEvidenceToggle ? 'line-clamp-3' : ''}`}>
                          {tip.evidence}
                        </p>
                        {shouldShowEvidenceToggle && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEvidence(tip.id)}
                            className="mt-2 h-6 text-xs text-gray-600 hover:text-gray-900 p-0"
                          >
                            {isEvidenceExpanded ? 'Show Less' : 'Show More'}
                            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isEvidenceExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        )}
                      </div>

                      {/* Key Metrics */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs text-red-600 tracking-wide">Key Metrics</h4>
                          <span className="text-[10px] text-gray-500">vs Previous Quarter</span>
                        </div>
                        <div className="space-y-1.5">
                          {tip.metricsTable.map((row, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1.5">
                              <span className="text-xs text-gray-600">{row.metric}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-900 tabular-nums">{row.value}</span>
                                <div className={`flex items-center gap-0.5 min-w-[60px] justify-end ${row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                  {row.change.startsWith('+') ? (
                                    <ArrowUpRight className="w-3 h-3" />
                                  ) : (
                                    <ArrowDownRight className="w-3 h-3" />
                                  )}
                                  <span className="text-xs tabular-nums">{row.change}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Assessment Section */}
                      <div className="pt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={assessment === 'agree' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onAssessmentChange(tip.id, assessment === 'agree' ? null : 'agree')}
                            className={`flex-1 h-9 gap-1.5 ${
                              assessment === 'agree'
                                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Agree
                          </Button>
                          <Button
                            variant={assessment === 'neutral' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onAssessmentChange(tip.id, assessment === 'neutral' ? null : 'neutral')}
                            className={`flex-1 h-9 gap-1.5 ${
                              assessment === 'neutral'
                                ? 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600'
                                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-600 hover:text-gray-700'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                            Neutral
                          </Button>
                          <Button
                            variant={assessment === 'disagree' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onAssessmentChange(tip.id, assessment === 'disagree' ? null : 'disagree')}
                            className={`flex-1 h-9 gap-1.5 ${
                              assessment === 'disagree'
                                ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                                : 'border-gray-300 hover:bg-red-50 hover:border-red-600 hover:text-red-700'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            Disagree
                          </Button>
                        </div>
                      </div>

                      {/* View Post Link */}
                      <div className="pt-3">
                        <button
                          onClick={() => onPostClick?.(tip.id)}
                          className="flex items-center justify-center md:justify-end w-full md:w-auto gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors group"
                        >
                          <span>View Post</span>
                          <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};