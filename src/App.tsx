import React, { useState, useEffect, useRef } from 'react';
import { TipCard } from './components/TipCard';
import { DetailView } from './components/DetailView';
import { NotesPanel } from './components/NotesPanel';
import { PostNotesPanel } from './components/PostNotesPanel';
import { StockNotesPanel } from './components/StockNotesPanel';
import { HeaderBar } from './components/HeaderBar';
import { StockView } from './components/StockView';
import { JournalView } from './components/JournalView';
import { PortfolioView } from './components/PortfolioView';
import { PostView } from './components/PostView';
import { AuthorView } from './components/AuthorView';
import { AboutView } from './components/AboutView';
import { AuthView } from './components/AuthView';
import { ScrollArea } from './components/ui/scroll-area';
import { Button } from './components/ui/button';
import { PanelRightOpen } from 'lucide-react';
import avatarImage from 'figma:asset/64d6c92f11e2d1ce2cca207aeacbb2617e5f4ce7.png';
import videoThumb1 from 'figma:asset/9bd3c6c5b13c2aa9c37cca48a8f7c60903766847.png';
import videoThumb2 from 'figma:asset/f9b2a91cd8d710708208d8ab18eff5ccd17222c4.png';

interface Tip {
  id: string;
  year: string;
  sentiment: 'bullish' | 'bearish';
  stockSymbol: string;
  stockName: string;
  metrics: {
    label: string;
    value: string;
  }[];
  title: string;
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
  assessment?: 'agree' | 'neutral' | 'disagree' | null;
}

const mockTips: Tip[] = [
  {
    id: '1',
    year: '2025 - Q4',
    sentiment: 'bullish',
    stockSymbol: 'MSFT',
    stockName: 'Microsoft Corporation',
    metrics: [
      { label: 'P/E', value: '28.4' },
      { label: 'ROE', value: '42.1%' },
      { label: 'EPS', value: '$6.42' },
      { label: 'Margin', value: '26.3%' }
    ],
    title: 'AI Infrastructure Thesis - Cloud Revenue Acceleration',
    assessment: 'agree',
    sourceType: 'video',
    source: {
      name: 'Sarah Chen',
      avatar: avatarImage,
      url: '#'
    },
    videoThumbnail: videoThumb1,
    thesis: 'Strong AI infrastructure play with expanding margins. Cloud services revenue accelerating quarter over quarter.',
    evidence: 'Q3 2025 earnings showed 47% YoY growth in cloud services, with AI-specific workloads growing 89%. Management guidance for Q4 indicates continued momentum with new enterprise contracts signed. Industry analysts project the addressable market to reach $500B by 2027.',
    metricsTable: [
      { metric: 'Revenue Growth (YoY)', value: '$42.3B', change: '+34%' },
      { metric: 'Gross Margin', value: '68.2%', change: '+3.2%' },
      { metric: 'Operating Cash Flow', value: '$18.7B', change: '+28%' },
      { metric: 'R&D Investment', value: '$7.2B', change: '+41%' }
    ]
  },
  {
    id: '2',
    year: '2025 - Q4',
    sentiment: 'bullish',
    stockSymbol: 'AAPL',
    stockName: 'Apple Inc.',
    metrics: [
      { label: 'P/E', value: '29.2' },
      { label: 'ROE', value: '147.4%' },
      { label: 'EPS', value: '$6.58' },
      { label: 'Margin', value: '25.3%' }
    ],
    title: 'Services Revenue Momentum - Wearables Growth',
    assessment: 'neutral',
    sourceType: 'video',
    source: {
      name: 'Sarah Chen',
      avatar: avatarImage,
      url: '#'
    },
    videoThumbnail: videoThumb2,
    thesis: 'Services segment driving margin expansion. Wearables and accessories showing strong growth trajectory.',
    evidence: 'Q3 services revenue reached $22.3B, up 16% YoY, with app store revenue growing 21%. Wearables segment grew 29% YoY with Apple Watch maintaining 34% market share. Management expects services to reach 25% of total revenue by 2026.',
    metricsTable: [
      { metric: 'Services Revenue', value: '$22.3B', change: '+16%' },
      { metric: 'Wearables Revenue', value: '$9.8B', change: '+29%' },
      { metric: 'Services Margin', value: '71.2%', change: '+4.8%' },
      { metric: 'Active Devices', value: '2.2B', change: '+8%' }
    ]
  },
  {
    id: '3',
    year: '2025 - Q4',
    sentiment: 'bullish',
    stockSymbol: 'TSLA',
    stockName: 'Tesla Inc.',
    metrics: [
      { label: 'P/E', value: '52.3' },
      { label: 'ROE', value: '28.9%' },
      { label: 'EPS', value: '$4.12' },
      { label: 'Margin', value: '18.2%' }
    ],
    title: 'Energy Storage Scale - Production Efficiency',
    assessment: null,
    sourceType: 'video',
    source: {
      name: 'Sarah Chen',
      avatar: avatarImage,
      url: '#'
    },
    videoThumbnail: videoThumb1,
    thesis: 'Energy storage business scaling rapidly. Manufacturing efficiency improvements driving margin expansion.',
    evidence: 'Energy storage deployments reached 9.4 GWh in Q3, up 90% YoY. Megapack orders backlogged through 2026. Vehicle production costs decreased 15% per unit through manufacturing improvements. FSD take rate increased to 18%.',
    metricsTable: [
      { metric: 'Energy Deployments', value: '9.4 GWh', change: '+90%' },
      { metric: 'Vehicle Production', value: '478K units', change: '+24%' },
      { metric: 'Gross Margin', value: '18.2%', change: '+2.4%' },
      { metric: 'FSD Take Rate', value: '18%', change: '+6%' }
    ]
  },
  {
    id: '4',
    year: '2025 - Q4',
    sentiment: 'bullish',
    stockSymbol: 'GOOG',
    stockName: 'Alphabet Inc.',
    metrics: [
      { label: 'P/E', value: '25.8' },
      { label: 'ROE', value: '31.2%' },
      { label: 'EPS', value: '$7.45' },
      { label: 'Margin', value: '27.4%' }
    ],
    title: 'Cloud Computing Growth - AI Search Integration',
    assessment: 'agree',
    sourceType: 'video',
    source: {
      name: 'Sarah Chen',
      avatar: avatarImage,
      url: '#'
    },
    videoThumbnail: videoThumb2,
    thesis: 'GCP gaining market share with AI-native offerings. Search integration with AI creating new monetization opportunities.',
    evidence: 'Google Cloud Platform revenue grew 28% YoY to $8.9B with operating margin turning positive at 5%. AI-powered search features driving 12% increase in search revenue per query. YouTube advertising revenue up 21% with Shorts monetization scaling.',
    metricsTable: [
      { metric: 'GCP Revenue', value: '$8.9B', change: '+28%' },
      { metric: 'Search Revenue/Query', value: '$0.43', change: '+12%' },
      { metric: 'YouTube Ad Revenue', value: '$7.95B', change: '+21%' },
      { metric: 'Operating Margin', value: '27.4%', change: '+3.1%' }
    ]
  },
  {
    id: '4b',
    year: '2025 - Q3',
    sentiment: 'bullish',
    stockSymbol: 'GOOGL',
    stockName: 'Alphabet Inc.',
    metrics: [
      { label: 'P/E', value: '25.8' },
      { label: 'ROE', value: '31.2%' },
      { label: 'EPS', value: '$7.45' },
      { label: 'Margin', value: '27.4%' }
    ],
    title: 'AI-Powered Search Evolution - Cloud Infrastructure Growth',
    assessment: 'agree',
    sourceType: 'video',
    source: {
      name: 'Sarah Chen',
      avatar: avatarImage,
      url: '#'
    },
    videoThumbnail: videoThumb1,
    thesis: 'Google Cloud Platform gaining market share with AI-native offerings. Search integration with AI creating new monetization opportunities and expanding TAM.',
    evidence: 'Google Cloud Platform revenue grew 28% YoY to $8.9B with operating margin turning positive at 5%. AI-powered search features driving 12% increase in search revenue per query. YouTube advertising revenue up 21% with Shorts monetization scaling. Waymo expansion into 3 new cities demonstrates autonomous driving leadership.',
    metricsTable: [
      { metric: 'GCP Revenue', value: '$8.9B', change: '+28%' },
      { metric: 'Search Revenue/Query', value: '$0.43', change: '+12%' },
      { metric: 'YouTube Ad Revenue', value: '$7.95B', change: '+21%' },
      { metric: 'Operating Margin', value: '27.4%', change: '+3.1%' }
    ]
  },
  {
    id: '5',
    year: '2025 - Q2',
    sentiment: 'bullish',
    stockSymbol: 'MSFT',
    stockName: 'Microsoft Corporation',
    metrics: [
      { label: 'P/E', value: '32.1' },
      { label: 'ROE', value: '38.7%' },
      { label: 'EPS', value: '$5.89' },
      { label: 'Margin', value: '24.8%' }
    ],
    title: 'Subscription Model Transition - Ecosystem Expansion',
    assessment: 'neutral',
    sourceType: 'article',
    source: {
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1758519288298-f0ceff4ccaa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGFuYWx5c3R8ZW58MXx8fHwxNzYxNDA0OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      url: '#'
    },
    articleInfo: {
      title: 'The SaaS Playbook: How Recurring Revenue Models Transform Valuations',
      source: 'TechCrunch Pro',
      thumbnail: 'https://images.unsplash.com/photo-1623683704451-ca4299bb3c99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ld3NsZXR0ZXIlMjBhcnRpY2xlfGVufDF8fHx8MTc2MTM5MjM0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      url: 'https://techcrunch.com/article'
    },
    thesis: 'Transition to subscription model showing traction. Customer retention improving with ecosystem lock-in effects.',
    evidence: 'Subscription revenue now represents 42% of total revenue, up from 28% last year. Net retention rate of 118% demonstrates strong upsell dynamics. New product launches in Q2 exceeded expectations with 2.3M units sold.',
    metricsTable: [
      { metric: 'Subscription Revenue', value: '$12.8B', change: '+56%' },
      { metric: 'Net Retention Rate', value: '118%', change: '+8%' },
      { metric: 'Customer Lifetime Value', value: '$4,200', change: '+32%' },
      { metric: 'Churn Rate', value: '2.1%', change: '-0.8%' }
    ]
  },
  {
    id: '6',
    year: '2024 - Q4',
    sentiment: 'bullish',
    stockSymbol: 'AAPL',
    stockName: 'Apple Inc.',
    metrics: [
      { label: 'P/E', value: '24.6' },
      { label: 'ROE', value: '34.2%' },
      { label: 'EPS', value: '$4.98' },
      { label: 'Margin', value: '22.1%' }
    ],
    title: 'International Expansion - Regulatory Tailwinds',
    assessment: null,
    sourceType: 'video',
    source: {
      name: 'Jennifer Park',
      avatar: 'https://images.unsplash.com/photo-1585554414787-09b821c321c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGV4ZWN1dGl2ZXxlbnwxfHx8fDE3NjEzOTUwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      url: '#'
    },
    videoThumbnail: videoThumb1,
    thesis: 'International expansion gaining momentum. Regulatory approval in key markets opening new growth vectors.',
    evidence: 'International revenue grew 68% QoQ following regulatory approvals. Partnerships with three major distributors provide access to 180M potential customers. Management projects international to represent 35% of revenue by 2026.',
    metricsTable: [
      { metric: 'International Revenue', value: '$8.4B', change: '+68%' },
      { metric: 'Market Penetration (EU)', value: '12%', change: '+9%' },
      { metric: 'Partnership Pipeline', value: '23 deals', change: '+15' },
      { metric: 'Localization Investment', value: '$420M', change: '+112%' }
    ]
  },
  {
    id: '7',
    year: '2024 - Q2',
    sentiment: 'bearish',
    stockSymbol: 'MSFT',
    stockName: 'Microsoft Corporation',
    metrics: [
      { label: 'P/E', value: '26.8' },
      { label: 'ROE', value: '31.5%' },
      { label: 'EPS', value: '$4.52' },
      { label: 'Margin', value: '20.4%' }
    ],
    title: 'Operational Efficiency - Margin Expansion Play',
    assessment: 'disagree',
    sourceType: 'article',
    source: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTQwNDk0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      url: '#'
    },
    articleInfo: {
      title: 'AI-Driven Automation: The Secret to Margin Expansion in Modern Tech',
      source: 'Benedict Evans Newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1702047135360-e549c2e1f7df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjEzMTAyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      url: 'https://newsletter.example.com/article'
    },
    thesis: 'Cost optimization initiative driving margin expansion. Automation investments reducing operational overhead.',
    evidence: 'Operating margin expanded 340 basis points YoY despite increased R&D investment. Automation reduced customer service costs by 42%. Management expects margin expansion to continue through 2025.',
    metricsTable: [
      { metric: 'Operating Margin', value: '20.4%', change: '+3.4%' },
      { metric: 'Cost per Transaction', value: '$1.24', change: '-28%' },
      { metric: 'Automation Coverage', value: '67%', change: '+24%' },
      { metric: 'Headcount Efficiency', value: '$890K/employee', change: '+31%' }
    ]
  }
];

export default function App() {
  const [selectedTipId, setSelectedTipId] = useState<string>(mockTips[0].id);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'stock' | 'portfolio' | 'post' | 'journal' | 'author' | 'about' | 'auth'>('timeline');
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedAuthorName, setSelectedAuthorName] = useState<string | null>(null);
  const [activePostStockSymbol, setActivePostStockSymbol] = useState<string | null>(null);
  const [isPostNotesPanelOpen, setIsPostNotesPanelOpen] = useState(false);
  const [showMobileFeed, setShowMobileFeed] = useState(true);
  const [showMobileNotes, setShowMobileNotes] = useState(false);
  
  // Mobile state for Post view notes
  const [showPostMobileNotes, setShowPostMobileNotes] = useState(false);
  
  // Stock view states
  const [isStockNotesPanelOpen, setIsStockNotesPanelOpen] = useState(false);
  const [showStockMobileNotes, setShowStockMobileNotes] = useState(false);
  const [activeStockTipId, setActiveStockTipId] = useState<string | null>(null);
  
  // Store assessments per tip
  const [tipAssessments, setTipAssessments] = useState<Record<string, 'agree' | 'neutral' | 'disagree' | null>>({
    '1': 'agree',
    '2': 'neutral',
    '4': 'agree',
    '7': 'disagree'
  });
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const selectedTip = mockTips.find(tip => tip.id === selectedTipId) || null;
  const selectedIndex = mockTips.findIndex(tip => tip.id === selectedTipId);

  // Mock stock positions - in real app, this would come from an API
  const mockPositions: Record<string, any> = {
    'MSFT': {
      openQty: 12,
      avgCost: 144.35,
      valuation: 2160.00,
      unrealizedPL: 427.75,
      realizedPL: 103.55,
      winRate: 100
    },
    'GOOGL': {
      openQty: 300,
      avgCost: 180.00,
      valuation: 54000.00,
      unrealizedPL: 6750.00,
      realizedPL: 0,
      winRate: 100
    }
  };

  // Mock stock prices
  const mockStockPrices: Record<string, { price: number; change: number; changePercent: number }> = {
    'MSFT': { price: 180.00, change: 2.45, changePercent: 1.38 },
    'AAPL': { price: 178.50, change: -1.20, changePercent: -0.67 },
    'GOOGL': { price: 202.50, change: 4.25, changePercent: 2.14 },
    'GOOG': { price: 202.50, change: 4.25, changePercent: 2.14 }
  };

  // Mock notes - in real app, this would be stored in a database
  const mockNotes: Record<string, any[]> = {
    '1': [
      {
        id: '1',
        date: 'Oct 15, 2025',
        content: 'Reviewed Q3 earnings - strong performance in cloud segment. Consider increasing position if price dips below $145.'
      },
      {
        id: '2',
        date: 'Sep 22, 2025',
        content: 'Management commentary on earnings call was optimistic. New product launch showing early traction.'
      }
    ],
    '2': [
      {
        id: '3',
        date: 'Oct 10, 2025',
        content: 'Subscription model showing strong traction. Customer retention metrics improving.'
      }
    ]
  };

  const handleStockClick = (stockSymbol: string) => {
    setSelectedStockSymbol(stockSymbol);
    setViewMode('stock');
    setIsStockNotesPanelOpen(true);
    setShowStockMobileNotes(false);
    setActiveStockTipId(null);
  };

  const handleBackToTimeline = () => {
    setViewMode('timeline');
    setSelectedStockSymbol(null);
    setShowMobileFeed(true);
    setIsStockNotesPanelOpen(false);
    setShowStockMobileNotes(false);
  };

  const handleJournalView = () => {
    if (selectedStockSymbol) {
      setViewMode('journal');
    }
  };

  const handleBackFromJournal = () => {
    setViewMode('stock');
  };

  const handleStockNotesToggle = () => {
    setShowStockMobileNotes(!showStockMobileNotes);
  };

  const handleAssessmentChange = (tipId: string, assessment: 'agree' | 'neutral' | 'disagree' | null) => {
    setTipAssessments(prev => ({
      ...prev,
      [tipId]: assessment
    }));
  };

  const handlePortfolioView = () => {
    setViewMode('portfolio');
  };

  const handlePortfolioViewStock = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setViewMode('stock');
    setIsStockNotesPanelOpen(true);
    setShowStockMobileNotes(false);
  };

  const handlePortfolioTradeJournal = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setViewMode('journal');
  };

  const handleLogoClick = () => {
    setViewMode('timeline');
    setSelectedStockSymbol(null);
    setShowMobileFeed(true);
  };

  const handleTipClickFromStock = (tipId: string) => {
    setSelectedTipId(tipId);
    setViewMode('timeline');
    setSelectedStockSymbol(null);
    setShowMobileFeed(false); // On mobile, show detail view directly
  };

  const handleMobileTipClick = (tipId: string) => {
    setSelectedTipId(tipId);
    setShowMobileFeed(false);
  };

  const handleMobileBackToFeed = () => {
    setShowMobileFeed(true);
    setShowMobileNotes(false);
    setIsNotesPanelOpen(false);
  };

  const handleMobileNotesOpen = () => {
    setIsNotesPanelOpen(true);
    setShowMobileNotes(true);
  };

  const handleMobileNotesClose = () => {
    setShowMobileNotes(false);
  };

  const handlePostView = (postId: string) => {
    setSelectedPostId(postId);
    setViewMode('post');
    setIsPostNotesPanelOpen(true);
    setShowPostMobileNotes(false);
  };

  const handleBackFromPost = () => {
    setViewMode('timeline');
    setSelectedPostId(null);
    setIsPostNotesPanelOpen(false);
    setActivePostStockSymbol(null);
    setShowMobileFeed(true);
    setShowPostMobileNotes(false);
  };

  const handlePostNotesToggle = () => {
    const newState = !showPostMobileNotes;
    setShowPostMobileNotes(newState);
    if (newState) {
      setIsPostNotesPanelOpen(true);
    }
  };

  const handleAuthorView = (authorName: string) => {
    setSelectedAuthorName(authorName);
    setViewMode('author');
  };

  const handleBackFromAuthor = () => {
    setViewMode('timeline');
    setSelectedAuthorName(null);
    setShowMobileFeed(true);
  };

  const handleAboutView = () => {
    setViewMode('about');
  };

  const handleBackFromAbout = () => {
    setViewMode('timeline');
    setShowMobileFeed(true);
  };

  const handleAuthView = () => {
    setViewMode('auth');
  };

  const handleBackFromAuth = () => {
    setViewMode('timeline');
    setShowMobileFeed(true);
  };

  // Get stock data for stock view
  const getStockData = () => {
    if (!selectedStockSymbol) return null;

    const stockTips = mockTips.filter(tip => tip.stockSymbol === selectedStockSymbol);
    const stockPrice = mockStockPrices[selectedStockSymbol] || { price: 0, change: 0, changePercent: 0 };
    const position = mockPositions[selectedStockSymbol] || null;

    return {
      stockSymbol: selectedStockSymbol,
      stockName: stockTips[0]?.stockName || '',
      currentPrice: stockPrice.price,
      priceChange: stockPrice.change,
      priceChangePercent: stockPrice.changePercent,
      position,
      tips: stockTips
    };
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(selectedIndex + 1, mockTips.length - 1);
        if (nextIndex !== selectedIndex) {
          setSelectedTipId(mockTips[nextIndex].id);
          scrollToCard(mockTips[nextIndex].id);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(selectedIndex - 1, 0);
        if (prevIndex !== selectedIndex) {
          setSelectedTipId(mockTips[prevIndex].id);
          scrollToCard(mockTips[prevIndex].id);
        }
      }
    };

    const timelineElement = timelineRef.current;
    if (timelineElement) {
      timelineElement.addEventListener('keydown', handleKeyDown);
      return () => {
        timelineElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedIndex]);

  // Auto-scroll to keep selected card centered
  const scrollToCard = (tipId: string) => {
    const cardElement = cardRefs.current.get(tipId);
    if (cardElement) {
      cardElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  const setCardRef = (tipId: string, element: HTMLDivElement | null) => {
    if (element) {
      cardRefs.current.set(tipId, element);
    } else {
      cardRefs.current.delete(tipId);
    }
  };

  const stockData = getStockData();

  // Get post data
  const getPostData = () => {
    if (!selectedPostId) return null;

    const selectedTip = mockTips.find(tip => tip.id === selectedPostId);
    if (!selectedTip) return null;

    // For now, all tips from the same source would be grouped together
    // In a real app, you'd have a post ID and fetch all tips for that post
    const postTips = mockTips.filter(tip => 
      tip.source.name === selectedTip.source.name && 
      tip.sourceType === selectedTip.sourceType
    );

    // Generate post title and summary based on type
    const postTitle = selectedTip.sourceType === 'video' 
      ? 'Tech Leaders Q4 2025: AI, Cloud & Energy Storage Analysis' 
      : selectedTip.articleInfo?.title || 'Article Analysis';
    
    const postSummary = selectedTip.sourceType === 'video'
      ? 'Comprehensive quarterly review of major tech stocks covering AI infrastructure, cloud services, energy storage, and search monetization opportunities.'
      : 'Deep dive into subscription business models and how they transform company valuations in the modern tech landscape.';

    return {
      id: selectedPostId,
      type: selectedTip.sourceType,
      title: postTitle,
      date: 'Oct 29, 2025',
      quarter: selectedTip.sourceType === 'video' ? '2025 - Q4' : '2025 - Q2',
      source: selectedTip.source,
      videoUrl: selectedTip.videoThumbnail,
      videoThumbnail: selectedTip.videoThumbnail,
      articleInfo: selectedTip.articleInfo,
      summary: postSummary,
      tips: postTips
    };
  };

  const postData = getPostData();

  // Get author data
  const getAuthorData = () => {
    if (!selectedAuthorName) return null;

    // Find all tips by this author
    const authorTips = mockTips.filter(tip => tip.source.name === selectedAuthorName);
    if (authorTips.length === 0) return null;

    const author = authorTips[0].source;

    // Create multiple posts for the author
    const posts = [
      {
        id: '1',
        type: 'video' as const,
        title: 'Tech Leaders Q4 2025: AI, Cloud & Energy Storage Analysis',
        date: 'Oct 29, 2025',
        quarter: '2025 - Q4',
        thumbnail: '',
        summary: 'Comprehensive quarterly review of major tech stocks covering AI infrastructure, cloud services, energy storage, and search monetization opportunities.'
      },
      {
        id: '7',
        type: 'article' as const,
        title: 'The Rise of Subscription Business Models: Implications for Tech Valuations',
        date: 'Oct 15, 2025',
        quarter: '2025 - Q4',
        thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzYxNzE2MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        summary: 'Deep dive into subscription business models and how they transform company valuations in the modern tech landscape.'
      },
      {
        id: '8',
        type: 'video' as const,
        title: 'Q3 Earnings Season Recap: Winners and Losers in Cloud Computing',
        date: 'Oct 8, 2025',
        quarter: '2025 - Q3',
        thumbnail: '',
        summary: 'Analysis of Q3 earnings results from major cloud providers, examining revenue growth, margin expansion, and forward guidance.'
      },
      {
        id: '9',
        type: 'article' as const,
        title: 'Market Volatility Analysis: Navigating Rate Uncertainty in Tech Stocks',
        date: 'Sep 28, 2025',
        quarter: '2025 - Q3',
        thumbnail: 'https://images.unsplash.com/photo-1645226880663-81561dcab0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGNoYXJ0fGVufDF8fHx8MTc2MTc1NDUyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        summary: 'Examining the impact of interest rate volatility on technology sector valuations and portfolio positioning strategies.'
      },
      {
        id: '10',
        type: 'video' as const,
        title: 'AI Investment Opportunities: Separating Hype from Reality',
        date: 'Sep 15, 2025',
        quarter: '2025 - Q3',
        thumbnail: '',
        summary: 'Evaluating AI infrastructure investments, identifying companies with sustainable competitive advantages and realistic growth trajectories.'
      },
      {
        id: '11',
        type: 'article' as const,
        title: 'Enterprise Software Consolidation: M&A Trends and Value Creation',
        date: 'Aug 30, 2025',
        quarter: '2025 - Q3',
        thumbnail: 'https://images.unsplash.com/photo-1672870153618-b369bcc8c55d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBuZXdzfGVufDF8fHx8MTc2MTY4ODMzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        summary: 'Analysis of recent M&A activity in enterprise software, evaluating strategic rationale and potential synergies for acquirers.'
      }
    ];

    return {
      author: {
        name: author.name,
        avatar: author.avatar,
        bio: 'Senior Equity Research Analyst specializing in technology sector analysis. Over 15 years of experience covering cloud infrastructure, AI, and enterprise software companies. Known for deep-dive fundamental analysis and accurate earnings predictions.'
      },
      posts
    };
  };

  const authorData = getAuthorData();

  return (
    <div className="h-screen flex flex-col bg-[#f9fafb]">
      {/* Header */}
      <HeaderBar 
        onPortfolioClick={handlePortfolioView} 
        onAboutClick={handleAboutView}
        onAuthClick={handleAuthView}
        onLogoClick={handleLogoClick} 
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'auth' ? (
          /* Auth View */
          <div className="flex-1 w-full">
            <AuthView onBack={handleBackFromAuth} />
          </div>
        ) : viewMode === 'about' ? (
          /* About View */
          <div className="flex-1 w-full">
            <AboutView onBack={handleBackFromAbout} />
          </div>
        ) : viewMode === 'author' && authorData ? (
          /* Author View */
          <div className="flex-1 w-full">
            <AuthorView
              author={authorData.author}
              posts={authorData.posts}
              onBack={handleBackFromAuthor}
              onPostClick={handlePostView}
            />
          </div>
        ) : viewMode === 'post' && postData ? (
          /* Post View */
          <>
            {/* Post Content - Hidden on mobile when notes are open */}
            <div className={`${showPostMobileNotes ? 'hidden' : 'flex'} md:flex ${isPostNotesPanelOpen ? 'md:w-[75%]' : 'w-full'} w-full transition-all`}>
              <PostView
                post={postData}
                tips={postData.tips}
                assessments={tipAssessments}
                onAssessmentChange={handleAssessmentChange}
                onBack={handleBackFromPost}
                onStockClick={handleStockClick}
                onNotesClick={handlePostNotesToggle}
                onTipVisible={(stockSymbol) => setActivePostStockSymbol(stockSymbol)}
                onAuthorClick={handleAuthorView}
                onPostClick={handlePostView}
              />
            </div>
            
            {/* Notes Panel - Desktop: side panel, Mobile: full width when open */}
            {isPostNotesPanelOpen && (
              <div className={`${showPostMobileNotes ? 'flex' : 'hidden'} md:flex md:w-[25%] w-full h-full`}>
                <PostNotesPanel 
                  isOpen={isPostNotesPanelOpen} 
                  onClose={() => {
                    setIsPostNotesPanelOpen(false);
                    setShowPostMobileNotes(false);
                  }}
                  tips={postData.tips}
                  activeStockSymbol={activePostStockSymbol || undefined}
                  onMobileBack={() => setShowPostMobileNotes(false)}
                  showMobileBack={showPostMobileNotes}
                />
              </div>
            )}
            
            {/* Desktop: Toggle notes button when panel is closed */}
            {!isPostNotesPanelOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPostNotesPanelOpen(true)}
                className="hidden md:flex fixed right-4 top-20 z-10 gap-2 bg-white border-gray-300"
              >
                <PanelRightOpen className="w-4 h-4" />
                Notes
              </Button>
            )}
          </>
        ) : viewMode === 'portfolio' ? (
          /* Portfolio View */
          <div className="flex-1 w-full">
            <PortfolioView
              onViewStock={handlePortfolioViewStock}
              onTradeJournal={handlePortfolioTradeJournal}
            />
          </div>
        ) : viewMode === 'journal' && stockData ? (
          /* Journal View */
          <div className="flex-1 w-full">
            <JournalView
              stockSymbol={stockData.stockSymbol}
              stockName={stockData.stockName}
              position={stockData.position}
              onBack={handleBackFromJournal}
            />
          </div>
        ) : viewMode === 'stock' && stockData ? (
          /* Stock View */
          <>
            {/* Stock Content - Hidden on mobile when notes are open */}
            <div className={`${showStockMobileNotes ? 'hidden' : 'flex'} md:flex ${isStockNotesPanelOpen ? 'md:w-[75%]' : 'w-full'} w-full transition-all`}>
              <StockView
                stockSymbol={stockData.stockSymbol}
                stockName={stockData.stockName}
                currentPrice={stockData.currentPrice}
                priceChange={stockData.priceChange}
                priceChangePercent={stockData.priceChangePercent}
                position={stockData.position}
                tips={stockData.tips}
                assessments={tipAssessments}
                onAssessmentChange={handleAssessmentChange}
                onBack={handleBackToTimeline}
                onNotesClick={handleStockNotesToggle}
                onTipVisible={(tipId) => setActiveStockTipId(tipId)}
                onJournalClick={handleJournalView}
                onPostClick={handlePostView}
              />
            </div>
            
            {/* Notes Panel - Desktop: side panel, Mobile: full width when open */}
            {isStockNotesPanelOpen && (
              <div className={`${showStockMobileNotes ? 'flex' : 'hidden'} md:flex md:w-[25%] w-full h-full`}>
                <StockNotesPanel 
                  isOpen={isStockNotesPanelOpen} 
                  onClose={() => {
                    setIsStockNotesPanelOpen(false);
                    setShowStockMobileNotes(false);
                  }}
                  stockSymbol={stockData.stockSymbol}
                  stockName={stockData.stockName}
                  tips={stockData.tips.map(tip => ({
                    id: tip.id,
                    title: tip.title,
                    year: tip.year
                  }))}
                  activeTipId={activeStockTipId || undefined}
                  onMobileBack={() => setShowStockMobileNotes(false)}
                  showMobileBack={showStockMobileNotes}
                />
              </div>
            )}
            
            {/* Desktop: Toggle notes button when panel is closed */}
            {!isStockNotesPanelOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStockNotesPanelOpen(true)}
                className="hidden md:flex fixed right-4 top-20 z-10 gap-2 bg-white border-gray-300"
              >
                <PanelRightOpen className="w-4 h-4" />
                Notes
              </Button>
            )}
          </>
        ) : (
          <>
            {/* Mobile: Tips Timeline (Full Width on Mobile, Hidden on Detail) */}
            <div 
              ref={timelineRef}
              className={`${showMobileFeed ? 'flex' : 'hidden'} md:flex w-full md:w-[20%] bg-gray-50 border-r border-gray-300 flex-col focus:outline-none`}
              tabIndex={0}
              role="list"
              aria-label="Stock tips timeline"
            >
              {/* Tips Header */}
              <div className="px-4 pt-3 pb-2.5 flex-shrink-0 bg-[#fafafa]">
                <h2 className="text-xs text-gray-500 uppercase tracking-wide border-l-[3px] border-green-600 pl-2.5">Tips</h2>
              </div>
              
              <ScrollArea className="flex-1 p-2">
                {mockTips.map((tip, index) => (
                  <TipCard
                    key={tip.id}
                    ref={(el) => setCardRef(tip.id, el)}
                    year={tip.year}
                    stockSymbol={tip.stockSymbol}
                    thesis={tip.thesis}
                    sentiment={tip.sentiment}
                    metrics={tip.metrics}
                    isSelected={selectedTipId === tip.id}
                    onClick={() => {
                      setSelectedTipId(tip.id);
                      handleMobileTipClick(tip.id);
                    }}
                    tabIndex={selectedTipId === tip.id ? 0 : -1}
                    ariaSelected={selectedTipId === tip.id}
                  />
                ))}
              </ScrollArea>
            </div>

            {/* Mobile: Detail View (Full Width on Mobile when Tip Selected, Hidden on Feed or Notes) */}
            <div className={`${!showMobileFeed && !showMobileNotes ? 'flex' : 'hidden'} md:flex ${isNotesPanelOpen ? 'md:w-[55%]' : 'md:w-[80%]'} w-full bg-white border-r border-gray-300 transition-all flex-col`}>
              <DetailView 
                tip={selectedTip} 
                assessment={selectedTip ? tipAssessments[selectedTip.id] || null : null}
                onAssessmentChange={selectedTip ? (assessment) => handleAssessmentChange(selectedTip.id, assessment) : () => {}}
                onStockClick={handleStockClick}
                onNotesClick={handleMobileNotesOpen}
                onPostClick={handlePostView}
                onAuthorClick={handleAuthorView}
                showNotesButton={!isNotesPanelOpen}
                onMobileBack={handleMobileBackToFeed}
                showMobileBack={!showMobileFeed}
              />
            </div>

            {/* Right Column - Notes Panel (25% on Desktop, Full Width on Mobile when Open) */}
            {isNotesPanelOpen && (
              <div className={`${showMobileNotes ? 'flex' : 'hidden'} md:flex md:w-[25%] w-full flex-col`}>
                <NotesPanel 
                  isOpen={isNotesPanelOpen} 
                  onClose={() => {
                    setIsNotesPanelOpen(false);
                    setShowMobileNotes(false);
                  }}
                  tip={selectedTip}
                  onMobileBack={handleMobileNotesClose}
                  showMobileBack={showMobileNotes}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}