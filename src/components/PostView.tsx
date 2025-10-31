import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Play, ArrowUpRight, ArrowDownRight, ChevronDown, ThumbsUp, Minus, ThumbsDown, StickyNote, ExternalLink, FileText, Menu, Search, ChevronLeft, TrendingUp, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Logo } from './Logo';

interface PostViewProps {
  post: {
    id: string;
    type: 'video' | 'article';
    title: string;
    date: string;
    quarter: string;
    source: {
      name: string;
      avatar: string;
    };
    videoUrl?: string;
    videoThumbnail?: string;
    articleInfo?: {
      title: string;
      source: string;
      thumbnail: string;
      url: string;
    };
    summary?: string;
  };
  tips: Array<{
    id: string;
    title: string;
    stockSymbol: string;
    stockName: string;
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
  onStockClick?: (stockSymbol: string) => void;
  onNotesClick?: () => void;
  onTipVisible?: (stockSymbol: string) => void;
  onAuthorClick?: (authorName: string) => void;
  onPostClick?: (postId: string) => void;
}

export const PostView: React.FC<PostViewProps> = ({
  post,
  tips,
  assessments,
  onAssessmentChange,
  onBack,
  onStockClick,
  onNotesClick,
  onTipVisible,
  onAuthorClick,
  onPostClick
}) => {
  const [expandedThesis, setExpandedThesis] = useState<Record<string, boolean>>({});
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});
  const tipRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      const containerMid = containerRect.top + containerRect.height / 3; // Check top third of viewport

      // Find which tip is most visible
      for (const tip of tips) {
        const element = tipRefs.current[tip.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < containerMid && rect.bottom > containerRect.top) {
            onTipVisible(tip.stockSymbol);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Track scroll position to collapse meta row
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setIsScrolled(scrollContainer.scrollTop > 10);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Mobile Header - Sticky */}
      <div className="md:hidden sticky top-0 z-10 bg-[#f7f8fa] border-b border-[#e5e7eb] flex-shrink-0">
        {/* Main Row - Menu, Logo, Pills, Search */}
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          {/* Left: Back Button */}
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-gray-200/50 rounded-lg transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Center: Logo + Pills */}
          <div className="flex items-center gap-2">
            {/* Logo with larger icon */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <div className="w-7 h-7 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xs text-[#111827]">Popular Strategy</span>
            </div>

            {/* Segmented Pills */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
              <button
                className="px-2.5 py-1 text-[10px] rounded-md bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-sm"
              >
                Stock
              </button>
              <button
                className="px-2.5 py-1 text-[10px] rounded-md text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sector
              </button>
            </div>
          </div>

          {/* Right: Search */}
          <button
            className="p-1.5 hover:bg-gray-200/50 rounded-lg transition-colors active:scale-95"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5 text-gray-600" />
          </button>
        </div>

        {/* Meta Row - Author, Date, Ticker, Notes (Collapses on scroll) */}
        <div 
          className={`overflow-hidden transition-all duration-200 ${
            isScrolled ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 pb-2 flex-wrap">
            {/* Author Chip */}
            <button
              onClick={() => onAuthorClick?.(post.source.name)}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors active:scale-95"
            >
              <Avatar className="w-3.5 h-3.5">
                <AvatarImage src={post.source.avatar} alt={post.source.name} />
                <AvatarFallback className="text-[8px]">{getInitials(post.source.name)}</AvatarFallback>
              </Avatar>
              <span>{post.source.name}</span>
            </button>

            {/* Date Chip */}
            <div className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] text-gray-600">
              {post.quarter}
            </div>

            {/* Ticker Chips for all tips */}
            {tips.slice(0, 2).map((tip) => (
              <button
                key={tip.id}
                onClick={() => onStockClick?.(tip.stockSymbol)}
                className="inline-flex items-center px-2 py-1 bg-green-50 border border-green-200 rounded-md text-[10px] text-green-700 hover:bg-green-100 hover:border-green-300 transition-colors active:scale-95"
              >
                {tip.stockSymbol}
              </button>
            ))}
            {tips.length > 2 && (
              <div className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded-md text-[10px] text-gray-500">
                +{tips.length - 2} more
              </div>
            )}

            {/* Notes Chip */}
            <button
              onClick={onNotesClick}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-md text-[10px] text-gray-700 hover:border-green-600 hover:bg-green-50 hover:text-green-700 transition-colors active:scale-95"
            >
              <StickyNote className="w-3 h-3" />
              <span>Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header Bar */}
      <div className="hidden md:flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0">
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
          <div className="flex items-center gap-3">
            <Avatar 
              className="w-7 h-7 border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onAuthorClick?.(post.source.name)}
            >
              <AvatarImage src={post.source.avatar} alt={post.source.name} />
              <AvatarFallback className="text-[10px]">
                {getInitials(post.source.name)}
              </AvatarFallback>
            </Avatar>
            <span 
              className="text-xs text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
              onClick={() => onAuthorClick?.(post.source.name)}
            >
              {post.source.name}
            </span>
            <div className="text-xs text-red-600 tracking-wide">{post.quarter}</div>
          </div>
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
          {/* Post Title */}
          <div className="px-4 md:px-6 pt-6 pb-4">
            <h1 className="text-2xl text-gray-900">{post.title}</h1>
          </div>

          {/* Media Embed - Video or Article */}
          <div className="px-4 md:px-6 mb-6">
            {post.type === 'video' ? (
              /* YouTube Video Embed */
              <div className="aspect-video bg-gray-900 rounded overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/4yZo_4p6tvo"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : post.articleInfo ? (
              /* Article URL Preview */
              <a 
                href={post.articleInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex gap-4 p-4">
                    {/* Article Thumbnail */}
                    <div className="flex-shrink-0 w-32 h-24 rounded overflow-hidden bg-gray-100 relative">
                      <ImageWithFallback 
                        src={post.articleInfo.thumbnail} 
                        alt={post.articleInfo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-white/95 rounded p-1">
                        <FileText className="w-3 h-3 text-gray-700" />
                      </div>
                    </div>
                    
                    {/* Article Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm text-gray-900 leading-tight flex-1">{post.articleInfo.title}</h3>
                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{post.articleInfo.source}</p>
                      {post.summary && (
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{post.summary}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </a>
            ) : null}
          </div>

          {/* Post Summary */}
          {post.summary && (
            <div className="px-4 md:px-6 mb-6">
              <Card className="shadow-sm border-gray-200">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm text-gray-900">Post Summary</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{post.summary}</p>
                </div>
              </Card>
            </div>
          )}

          {/* Tips List */}
          <div className="px-4 md:px-6 pb-6 space-y-6">
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
                    {/* Tip Header - Stock Symbol and Title */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h2 className="text-lg text-gray-900 leading-tight mb-1">{tip.title}</h2>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{tip.stockName}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStockClick?.(tip.stockSymbol)}
                          className="gap-1.5 h-[26px] px-2.5 text-xs text-green-700 border-green-600 bg-green-50 hover:bg-green-100 hover:text-green-800 hover:border-green-700 rounded flex-shrink-0"
                        >
                          {tip.stockSymbol}
                        </Button>
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