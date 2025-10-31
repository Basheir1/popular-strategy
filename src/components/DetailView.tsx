import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Play, ChevronDown, ExternalLink, ArrowUpRight, ArrowDownRight, FileText, ThumbsUp, Minus, ThumbsDown, StickyNote, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface DetailViewProps {
  tip: {
    id: string;
    year: string;
    title: string;
    stockSymbol: string;
    stockName: string;
    sourceType: 'video' | 'article';
    source: {
      name: string;
      avatar: string;
      url?: string;
    };
    videoThumbnail?: string;
    articleInfo?: {
      title: string;
      source: string;
      thumbnail: string;
      url: string;
    };
    thesis: string;
    evidence: string;
    metricsTable: {
      metric: string;
      value: string;
      change: string;
    }[];
  } | null;
  assessment: 'agree' | 'neutral' | 'disagree' | null;
  onAssessmentChange: (assessment: 'agree' | 'neutral' | 'disagree' | null) => void;
  onStockClick?: (stockSymbol: string) => void;
  onNotesClick?: () => void;
  onPostClick?: (postId: string) => void;
  onAuthorClick?: (authorName: string) => void;
  showNotesButton?: boolean;
  onMobileBack?: () => void;
  showMobileBack?: boolean;
}

export const DetailView: React.FC<DetailViewProps> = ({ tip, assessment, onAssessmentChange, onStockClick, onNotesClick, onPostClick, onAuthorClick, showNotesButton = false, onMobileBack, showMobileBack = false }) => {
  const [isThesisExpanded, setIsThesisExpanded] = useState(false);
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!tip) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a tip to view details
      </div>
    );
  }

  const shouldShowThesisToggle = tip.thesis.length > 200;
  const shouldShowEvidenceToggle = tip.evidence.length > 200;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col relative">
      {/* Title Bar */}
      <div className="px-4 pt-3 pb-2.5 flex-shrink-0 bg-[#fafafa]">
        <h2 className="text-xs text-gray-500 uppercase tracking-wide opacity-0">Detail</h2>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Document Header */}
        <div className="px-4 py-2.5 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile Back Button + Author Info and Year */}
          <div className="flex items-center gap-3">
            {showMobileBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileBack}
                className="md:hidden gap-1.5 h-7 px-2 text-xs -ml-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            )}
            <Avatar 
              className="w-7 h-7 border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onAuthorClick?.(tip.source.name)}
            >
              <AvatarImage src={tip.source.avatar} alt={tip.source.name} />
              <AvatarFallback className="text-[10px]">
                {getInitials(tip.source.name)}
              </AvatarFallback>
            </Avatar>
            <span 
              className="text-xs text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
              onClick={() => onAuthorClick?.(tip.source.name)}
            >
              {tip.source.name}
            </span>
            <div className="text-xs text-red-600 tracking-wide">{tip.year}</div>
          </div>

          {/* Right: Stock Symbol and Notes Button */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStockClick?.(tip.stockSymbol)}
              className="gap-1.5 h-[24px] px-2.5 text-xs text-green-600 border-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700 hover:border-green-700 rounded"
            >
              {tip.stockSymbol}
            </Button>
            {showNotesButton && (
              <Button 
                variant="outline"
                size="sm"
                onClick={onNotesClick}
                className="gap-1.5 h-[24px] px-2.5 text-xs text-green-600 border-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700 hover:border-green-700 rounded"
              >
                <StickyNote className="w-3 h-3" />
                Notes
              </Button>
            )}
          </div>
        </div>
        
        {/* Title */}
        <div className="mt-2">
          <div className="flex items-start gap-3">
            {/* Video/Article Thumbnail */}
            <div 
              className="flex-shrink-0 w-[80px] aspect-video rounded overflow-hidden bg-gray-900 cursor-pointer hover:opacity-90 transition-opacity relative group"
              onClick={() => onPostClick?.(tip.id)}
            >
              {tip.sourceType === 'video' ? (
                <>
                  {tip.videoThumbnail ? (
                    <ImageWithFallback 
                      src={tip.videoThumbnail} 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800" />
                  )}
                  {/* YouTube-style play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </>
              ) : tip.articleInfo ? (
                <>
                  <ImageWithFallback 
                    src={tip.articleInfo.thumbnail} 
                    alt={tip.articleInfo.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Article indicator */}
                  <div className="absolute top-1 right-1 bg-white/90 rounded p-0.5">
                    <FileText className="w-2.5 h-2.5 text-gray-700" />
                  </div>
                </>
              ) : null}
            </div>
            
            {/* Title */}
            <h2 className="text-lg text-gray-900 leading-tight flex-1">{tip.title}</h2>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Thesis Summary Card */}
        <Card className="border-gray-200 rounded-lg overflow-visible">
          {/* Card Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-[#fafafa]">
            <h3 className="text-xs text-gray-500">Thesis Summary</h3>
          </div>
          
          {/* Card Body */}
          <div className="p-4">
            <p className="text-sm text-gray-700" style={{ lineHeight: 'normal' }}>
              {tip.thesis}
            </p>
          </div>
        </Card>

        {/* Section 2: Supporting Evidence */}
        <Card className="border-gray-200">
          <div className="px-3 py-2 bg-[#fafafa] border-b border-gray-200">
            <h3 className="text-xs text-gray-900">Supporting Evidence</h3>
          </div>
          <div className="p-3">
            <p className={`text-sm text-gray-700 leading-relaxed ${!isEvidenceExpanded && shouldShowEvidenceToggle ? 'line-clamp-3' : ''}`}>
              {tip.evidence}
            </p>
            {shouldShowEvidenceToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEvidenceExpanded(!isEvidenceExpanded)}
                className="mt-2 h-6 text-xs text-gray-600 hover:text-gray-900 p-0"
              >
                {isEvidenceExpanded ? 'Show Less' : 'Show More'}
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isEvidenceExpanded ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
        </Card>

        {/* Section 3: Metrics Table */}
        <Card className="border-gray-200">
          <div className="px-3 py-2 bg-[#fafafa] border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs text-gray-900">Key Metrics</h3>
              <span className="text-[10px] text-gray-500">vs Previous Quarter</span>
            </div>
          </div>
          <div className="p-0">
            <div className="divide-y divide-gray-100">
              {tip.metricsTable.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors">
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
        </Card>
      </div>

      {/* Assessment Toolbar */}
      <div className="sticky bottom-0 left-0 right-0 z-20">
        {/* Assessment Bar - Desktop */}
        <div className="px-4 pb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-2 flex items-center gap-2">
            <Button
              variant={assessment === 'agree' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onAssessmentChange(assessment === 'agree' ? null : 'agree')}
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
              onClick={() => onAssessmentChange(assessment === 'neutral' ? null : 'neutral')}
              className={`flex-1 h-9 gap-1.5 ${
                assessment === 'neutral'
                  ? 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Minus className="w-4 h-4" />
              Neutral
            </Button>
            <Button
              variant={assessment === 'disagree' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onAssessmentChange(assessment === 'disagree' ? null : 'disagree')}
              className={`flex-1 h-9 gap-1.5 ${
                assessment === 'disagree'
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              Disagree
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};